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

        // return;
        //create world bounds
        

        this.start();
    }

    start() {
        this.bg = new Background(this);
        this.player = new Player(this);
        this.bullets = new Bullets(this);
        this.enemy = new Enemy(this);
        this.ui = new UI(this);

        // Camera
        this.cameras.main.startFollow(this.player.sprite(), true, 0.05, 0, 0, this.height / 6);
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
        // this.bullets.make().make2();

        
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
        this.bullets.patternD();
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
            // debug: true,
        },
    },
    scene: Demo,
    backgroundColor: 0x111111,
};

var game = new Phaser.Game(config);

// 