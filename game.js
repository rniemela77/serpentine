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

    /*aquard
          Make map something like 500px width.
          Player starts at one side and needs to make it to the opposite.
          The "longer" the player takes, the more points. They can weave
          around bullets as carefully/slowly as they want to get more pts.

          option 2:
          there is a highlighted zone on the map. the player stays in that
          zone and earns points. the zone moves around the map. the player
          can move around the zone to avoid bullets and earn more points.

          option 3:
          big enemy at top of screen that needs to be attacked.


    */

    create() {
        this.width = (window.innerWidth * window.devicePixelRatio) * 1;
        this.height = (window.innerHeight * window.devicePixelRatio) * 1;
        this.cameraWidth = this.width / 3;


        // console.log('get width of map', this.width, this.height);


        // return;
        //create world bounds

        // screen wrap



        this.start();
    }

    start() {
        this.bg = new Background(this);
        this.player = new Player(this);
        this.bullets = new Bullets(this);
        this.enemy = new Enemy(this);
        this.ui = new UI(this);

        // Camera
        this.cameras.main.setBounds(0, 0, this.width, this.height);
        this.cameras.main.startFollow(this.player.sprite(), true, 0.1, 0, 0, this.height / 6);
        this.cameras.main.setZoom(1.5);

        // World Bounds
        this.physics.world.setBounds(0, 0, this.width, this.height);

        // Player Movement
        this.movement = new Movement(this);

        // Player heat
        this.playerHeat = this.player.generateHeat();

        // add bullets
        // this.bullets.createRandomBullets();
        // this.bullets.createRandomAstroids();

        // this.bullets.createPatternA();
        // this.bullets.createPatternB();
        // this.bullets.make().make2();
        // create a dot at the edge of gameworld


        // this.bullets.ringExpand(1);
        // this.bullets.create().ringExpand(2);
        // this.bullets.pattern1();


        // this.bullets.leftAndRightSpiral();
        // this.bullets.streams();
        // this.bullets.attackStreams()
        // this.bullets.createSpiral();
        // this.enemy.createEnemy();
        this.player.startShooting();
        this.enemy.createEnemies();


        // create bullet
        // const r = this.bullets.create(undefined, undefined, 50);
        // this.bullets.ringExpand(r, 10);


        // GOOD 
        this.bullets.patternC();
        // this.bullets.patternD();



        // on update
        this.events.on('update', () => {
            let nonPlayerObjects = this.bullets.enemyBullets.getChildren()
                .concat(this.enemy.enemies.getChildren())
                .concat(this.enemy.enemyBullets.getChildren());


            const playerIsMovingRight = this.player.velocityX > 0;
            const playerIsMovingLeft = this.player.velocityX < 0;

            const playerSpeed = this.player.velocityX / 50;

            this.player.sprite().x = this.width / 2;

            // console.log(playerSpeed)

            if (playerIsMovingRight) {
                nonPlayerObjects.forEach(obj => {
                    // move left
                    obj.x -= playerSpeed;
                });
            } else if (playerIsMovingLeft) {
                nonPlayerObjects.forEach(obj => {
                    obj.x -= playerSpeed;
                });
            }
            this.bg.mapGrid.x -= playerSpeed;

            // if bg is out of bounds, reset
            if (this.bg.mapGrid.x >= this.width / 4) {
                this.bg.mapGrid.x = 0;
            } else if (this.bg.mapGrid.x <= 0) {
                this.bg.mapGrid.x = this.width / 4;
            }


            nonPlayerObjects.forEach(obj => {
                if (obj.x < 1) {
                    obj.x = this.width - 10;
                } else if (obj.x > this.width - 1) {
                    obj.x = 10;
                }
            })

            // camera lerp
            this.cameras.main.scrollX -= 1;
        });
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
    backgroundColor: 0x111111,
};

var game = new Phaser.Game(config);

// 