// Core modules import 
import fs  from 'fs';
import path from 'path';
import util from 'util';
const __dirname = path.resolve();

import GIFEncoder from 'gif-encoder-2/src/GIFEncoder.js';
import pkg_canvas from 'canvas';
const { createCanvas, Image } = pkg_canvas;

 
const readdirAsync = util.promisify(fs.readdir)
const imagesFolder = path.join(__dirname, '../big-smile-nft/generation')
 
async function createGif(algorithm) {
  return new Promise(async resolve1 => {
    // read image directory
    const files = await readdirAsync(imagesFolder)
 
    // find the width and height of the image
    const [width, height] = await new Promise(resolve2 => {
      const image = new Image()
      image.onload = () => resolve2([image.width, image.height])
      image.src = path.join(imagesFolder, files[0])
    })
 
    // base GIF filepath on which algorithm is being used
    const dstPath = path.join(__dirname, 'output', `intermediate-${algorithm}.gif`)
    // create a write stream for GIF data
    const writeStream = fs.createWriteStream(dstPath)
    // when stream closes GIF is created so resolve promise
    writeStream.on('close', () => {
      resolve1()
    })
 
    const encoder = new GIFEncoder(width, height, algorithm)
    // pipe encoder's read stream to our write stream
    encoder.createReadStream().pipe(writeStream)
    encoder.start()
    encoder.setDelay(300)
 
 
    // draw an image for each file and add frame to encoder
    for (const file of files) {
      await new Promise(resolve3 => {
        const image = new Image()
        image.onload = () => {
          const canvas = createCanvas(width, height)
          const ctx = canvas.getContext('2d')
          console.log(image.src);
          ctx.drawImage(image, 0, 0)
          encoder.addFrame(ctx)
          resolve3()
        }
        image.src = path.join(imagesFolder, file)
      })
    }
  })
}
 
createGif('neuquant')
createGif('octree')