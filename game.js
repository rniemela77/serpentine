import Bullets from './scripts/bullets.js';
import Background from './scripts/bg.js';
import Movement from './scripts/movement.js';
import Player   from './scripts/player.js';
import Enemy from './scripts/enemy.js';

class Demo extends Phaser.Scene {
    preload() {
        this.load.image('player', 'assets/triangle.png');
    }

    /*

    */

    create() {
        this.width = window.innerWidth * window.devicePixelRatio;
        this.height = window.innerHeight * window.devicePixelRatio;

        
        this.bg = new Background(this);
        this.player = new Player(this);
        this.bullets = new Bullets(this);
        this.enemy = new Enemy(this);

        // Camera
        this.cameras.main.startFollow(this.player, true, 0.05, 0, 0, 200);
        this.cameras.main.setZoom(2);

        // Player Movement
        this.movement = new Movement(this);

        // add bullets
        // this.bullets.createRandomBullets();
        // this.bullets.createRandomAstroids();
        this.bullets.createRowsBullets();

    }
    update() {




        
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
            debug: true,
        },
    },
    scene: Demo,
    backgroundColor: 0x111111,
};

var game = new Phaser.Game(config);

