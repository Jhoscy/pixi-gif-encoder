// Core modules import
import fs  from 'fs';
import path  from 'path';
const __dirname = path.resolve();
// GIF modules import
import GIFEncoder from 'gif-encoder-2/src/GIFEncoder.js';
import pkg_canvas from 'canvas';
const { createCanvas, Image } = pkg_canvas;
// PixiJS moduels import
import { CanvasExtract } from '@pixi/canvas-extract';
import { CanvasRenderer } from '@pixi/canvas-renderer';
import {
    Application,
    Sprite,
    Text,
    filters,
    Container,
    Loader,
} from 'pixi.js';

import { light_00 } from './assets/light_00.png';
// const { light_00 } = require('./assets/light_00.png');
import background from './assets/light_01.jpg';
// const { background } = require('./assets/light_01.jpg');
import light_03 from './assets/light_03.png';
// const { light_03 } = require('./assets/light_03.png');
import nft from './assets/nft6_png.png';
// const { nft } = require('./assets/nft6_png.png');

CanvasRenderer.registerPlugin('extract', CanvasExtract);

const app = new Application();
//App.view is a canvas element, which is attached to the page
document.body.appendChild(app.view);

const loader = Loader.shared;

var encoder;

loader
.add('background', background)
.add('light_00', light_00)
.add('light_03', light_03)
.add('nft', nft)
.load(setup);

let background_texture, light_00_texture, light_03_texture, nft_texture;


function setup() {
    app.stage.interactive = true;


    background_texture = loader.resources["background"].texture;
    const background_sprite = new Sprite(background_texture);
    background_sprite.anchor.set(0.5);
    // background_sprite.x = app.screen.width / 2;
    // background_sprite.y = app.screen.height / 2;

    const filter = new filters.ColorMatrixFilter();
    // filter.vintage(true);
    // filter.toBGR();
    // filter.brightness(1.5);


    const container = new Container();
    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;

    container.addChild(background_sprite);

    light_00_texture = loader.resources["light_00"].texture;
    const light_00_sprite = new Sprite(light_00_texture);
    light_00_sprite.anchor.set(0.5);
    // container.addChild(light_00_sprite);

    light_03_texture = loader.resources["light_03"].texture;
    const light_03_sprite = new Sprite(light_03_texture);
    light_03_sprite.anchor.set(0.5);
    container.addChild(light_03_sprite);

    nft_texture = loader.resources["nft"].texture;
    const nft_sprite = new Sprite(nft_texture);
    nft_sprite.anchor.set(0.5);
    container.addChild(nft_sprite);


    app.stage.addChild(container);

    app.stage.filters = [filter];

    let count = 0;
    let enabled = true;

    app.stage.on('pointertap', () => {
        enabled = !enabled;
        app.stage.filters = enabled ? [filter] : null;
    });

    const help = new Text('Click or tap to turn filters on / off.', {
        fontFamily: 'Arial',
        fontSize: 12,
        fontWeight: 'bold',
        fill: 'white',
    });
    help.y = app.screen.height - 25;
    help.x = 10;

    app.stage.addChild(help);

    

    // app.ticker.add((delta) => {})
    // Transform canvas in 2d context with renderer
    // const big_smile_canvas = app.renderer.plugins.extract.canvas(container).getContext('2d');

    encoder = new GIFEncoder(app.stage.width, app.stage.height, 'neuquant', true);
    encoder.start();
    encoder.setDelay(100);

    setTicker();
    animate(4000);



    setTimeout(() => {
        try {
            createGIF(encoder);
        } catch(err) {
            console.log('ERROR GENERATING GIF', err);
            encoder.finish();
            app.ticker.destroy();
        }
    }, 50000);

    function setTicker() {
        app.ticker.autoStart = false;
        app.ticker.stop();
    }
    
    function animate(time) {
        if(app.ticker._head) {
            app.ticker.update(time);
            app.ticker.add(() => animation());
            // const big_smile_canvas = app.renderer.plugins.extract.canvas(app.stage).getContext('2d');
            // encoder.addFrame(big_smile_canvas);
            setTimeout(() => {
                console.log('timeout');
                //document.body.appendChild(app.renderer.plugins.extract.image(app.stage));
                
                // const big_smile_canvas = app.renderer.plugins.extract.canvas(app.stage).getContext('2d');
                // encoder.addFrame(big_smile_canvas);
                // const canvas = createCanvas(app.stage.width, app.stage.height);
                // const ctx = canvas.getContext('2d');
                // const image64 = app.renderer.plugins.extract.base64(app.stage);
                // const buffer = Buffer.from(image64, 'base64');
                // const image = new Image(); 
                // image.src = buffer;
                // console.log('buffer src', image.src);
                // ctx.drawImage(image, 0, 0);
                
                requestAnimationFrame(animate);
            }, 1000);
        }
    }

    function animation() {
        light_03_sprite.rotation += 0.01;

        // nft_sprite.scale.x = 1 + Math.sin(count) * 0.04;
        // nft_sprite.scale.y = 1 + Math.cos(count) * 0.04;

        count += 0.3;

        const { matrix } = filter;
        matrix[1] = Math.sin(count) * 0.07;
        matrix[2] = Math.cos(count);
        matrix[3] = Math.cos(count) * 0.1;
        matrix[4] = Math.sin(count / 3) * 0.2;
        matrix[5] = Math.sin(count / 2);
        matrix[6] = Math.sin(count / 4);

        const big_smile_canvas = app.renderer.plugins.extract.canvas(app.stage).getContext('2d');
        
        encoder.addFrame(big_smile_canvas);
    }

    /** Sezione di prova */
    console.log(app.renderer.plugins.extract.canvas(app.stage).getContext('2d'));
    console.log(app.renderer.plugins.extract.image(app.stage));
    // console.log(custom_canvas.toDataURL());
    console.log(app.renderer.plugins.extract.pixels(app.stage));
}

function createGIF(encoder) {
    const buffer = encoder.out.getData();

    fs.writeFile(path.join(__dirname, 'output', 'big_smile.gif'), buffer, error => {
        // gif drawn or error
        console.log(error);
    });
    // encoder.finish();
}

window.getBufferData = function getBufferData() {
    console.log(encoder.out.getData());
    return encoder.out.getData();
}




