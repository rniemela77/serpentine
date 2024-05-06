
// import Enemy from './scripts/enemies.js';
// import Player from './scripts/player.js';
// import Crosshair from './scripts/crosshair.js';
// import Map from './scripts/map.js';
// import Ui from './scripts/ui.js';
// import Effects from './scripts/effects.js';
// import Movement from './scripts/movement.js';
// import Attacks from './scripts/attacks.js';
// import Collision from './scripts/collision.js';

class Demo extends Phaser.Scene {
    preload() {
        this.load.image('player', 'assets/triangle.png');
    }

    /*

                MODIFIERY - JOWERS

    */

    create() {
    }

}



let width = window.innerWidth * window.devicePixelRatio;
let height = window.innerHeight * window.devicePixelRatio;

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: width,
    height: height,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            // debug: true,
        },
    },
    scene: Demo,
    backgroundColor: 0x000000,
};

var game = new Phaser.Game(config);