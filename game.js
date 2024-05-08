import Bullets from './scripts/bullets.js';
import Background from './scripts/bg.js';
import Movement from './scripts/movement.js';
import Player from './scripts/player.js';
import Enemy from './scripts/enemy.js';
import UI from './scripts/ui.js';

class Demo extends Phaser.Scene {
    preload() {
        this.load.image('player', 'assets/player.png');
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
        this.ui = new UI(this);



        // Camera
        this.cameras.main.startFollow(this.player.sprite(), true, 0.05, 0, 0, 200);
        this.cameras.main.setZoom(2);

        // Player Movement
        this.movement = new Movement(this);

        // Player heat
        this.playerHeat = this.player.generateHeat();

        // add bullets
        // this.bullets.createRandomBullets();
        // this.bullets.createRandomAstroids();

        // this.bullets.createPatternA();
        // this.bullets.createPatternB();
        // this.bullets.ringExpand();

        // every 500ms create a ring
        // this.bullets.createSpiral();

        // left and right rings
        // const leftCenter = { x: this.width / 3, y: this.height / 2 };
        // const rightCenter = { x: this.width * 2 / 3, y: this.height / 2 };
        // this.bullets.rotatingRing(leftCenter, 0.5, 3, 2, 1);
        // this.bullets.rotatingRing(rightCenter, 0.5, 3, 2, -1);

        // stream toward player
        // this.streams();
        this.attackStreams();

        // this.enemy.createEnemy();
        this.player.startShooting();
        this.enemy.createEnemies();





        // this.time.addEvent({
        //     delay: 800,
        //     callback: () => {
        //         this.bullets.createRow(100, 3, 6);
        //     },
        // });

        // this.bullets.createLine({ x: 0, y: 0 }, { x: this.width, y: this.height });

    }

    attackStreams() {

        // only works on odd number of streams
        const streams = [1];
        const numberOfStreams = 5;
        const streamAngle = 150;
        const center = { x: this.width / 2, y: this.height / 2 };
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                let streamPositions = [];

                for (let i = -numberOfStreams / 2; i <= numberOfStreams / 2; i++) {
                    streamPositions.push(
                        {
                            x: this.player.sprite().x + i * streamAngle,
                            y: this.player.sprite().y
                        });
                }

                streamPositions.forEach((pos) => {
                    this.bullets.streamTowardPosition(center, pos);
                });
            },
            loop: true,
        });
    }

    streams() {
        const center = { x: this.width / 2, y: this.height / 2 };
        this.time.addEvent({
            delay: 500,
            callback: () => {
                const playerPos = { x: this.player.sprite().x, y: this.player.sprite().y };
                this.bullets.streamTowardPosition(center, playerPos, 1.5, 20)
            },
            loop: true,
        });
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

// 