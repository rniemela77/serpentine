export default class Enemy {
    constructor(scene) {
        this.scene = scene;
        this.width = this.scene.width;
        this.height = this.scene.height;
        this.physics = this.scene.physics;
        this.player = this.scene.player;

        // create enemy
        // this.enemy = this.physics.add.sprite(this.width / 2, this.height * 0.6, '');
        // this.enemy.body.setCircle(100, 0, 0);
        // this.enemy.body.setOffset(-100, -100);

        // every 3sec
        // create bullet at enemy and fire it down


        // this.scene.time.addEvent({
        //     delay: 1000,
        //     callback: () => {
        //         const enemyBullet = this.physics.add.sprite(this.enemy.x, this.enemy.y, '');
        //         enemyBullet.setTint(0xff0000);
        //         enemyBullet.size = 10;
        //         enemyBullet.body.setCircle(enemyBullet.size, 0, 0);
        //         enemyBullet.body.setOffset(0, 0);
        //         enemyBullet.speed = 3;
        //         enemyBullet.setCollideWorldBounds(true);

        //         this.enemyBullets.add(enemyBullet);

        //     },
        //     loop: true
        // });

        // on update

        this.enemyBullets = this.scene.physics.add.group();
        this.scene.events.on('update', () => {
            const moveDownward = 0;
            const towardPlayer = 1;

            // for each enemy bullet
            this.enemyBullets.getChildren().forEach(bullet => {

                if (moveDownward) {
                    bullet.y += bullet.speed;

                    // if bullet goes off screen
                    if (bullet.y > this.height) {
                        // bullet.y = 0;
                        bullet.destroy();
                    }
                }

                if (towardPlayer) {
                    // player moves in direction of player plus player's velocity
                    bullet.x += (this.player.sprite().x - bullet.x) * 0.02 + 0.5;
                    bullet.y += bullet.speed;
                }
            });
        });
    }

    createEnemy() {
        // create 50x50 circle
        this.bigEnemy = this.physics.add.sprite(this.width / 2, this.height * 0.6, '');
        this.bigEnemy.alpha = 0;
        this.bigEnemy.body.setCircle(100, 0, 0);
        this.bigEnemy.body.setOffset(-100, -100);


        // every 3 sec, make enemy move left to right
        this.scene.time.addEvent({
            delay: 3000,
            callback: () => {
                if (this.bigEnemy.x < this.player.sprite().x) {
                    this.bigEnemy.setVelocityX(
                        Phaser.Math.Between(50, 100)
                    )
                } else {
                    this.bigEnemy.setVelocityX(
                        Phaser.Math.Between(-100, -50)
                    )
                }
            },
            loop: true
        });
    }

    createEnemies() {
        this.enemies = this.physics.add.group();

        const enemySize = 64;
        
        this.scene.time.addEvent({
            delay: 300,
            callback: () => {
                const enemy = this.scene.add.ellipse(
                    Math.random() * this.width,
                    300,
                    enemySize,
                    enemySize,
                ).setFillStyle(0x0000ff);
                
                this.physics.add.existing(enemy);
                enemy.body.setCircle(enemySize / 2, 0, 0);
                this.enemies.add(enemy);

                enemy.body.setVelocityX(Phaser.Math.Between(-100, 100));


                // if enemy collides with bullet
                this.physics.add.collider(this.player.playerBullets, this.enemies, (bullet, enemy) => {
                    bullet.destroy();
                    enemy.destroy();
                });
            },
            loop: true
        });
        
        // on update
        this.scene.events.on('update', () => {
            this.enemies.getChildren().forEach(enemy => {
                enemy.y += 1;
            });
        });
    }
}