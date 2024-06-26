export default class Player {
    constructor(scene) {
        this.scene = scene;
        this.width = this.scene.width;
        this.height = this.scene.height;
        this.physics = this.scene.physics;
        this.ui = this.scene.ui;


        const player = this.physics.add.sprite(this.width / 2, this.height * 0.8, ''); // Adjust position and sprite name
        this.player = player;
        // remove placeholder
        this.player.setAlpha(0);
        this.player.body.setCircle(8, 0, 0); // Adjust circle size and offset
        this.player.body.setOffset(8, 8); // Adjust circle size and offset
        player.setCollideWorldBounds(true); // Prevent player from going off-screen
        player.setDragX(10); // Apply horizontal drag for gliding effect

        // create an oval svg
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0x5577ff, 1);
        graphics.fillEllipse(0, 0, 32, 16);
        graphics.x = player.x;
        graphics.y = player.y;
        graphics.setDepth(1);
        graphics.setRotation(Math.PI / 2);
        this.graphic = graphics;




        // on update
        this.scene.events.on('update', () => {
            graphics.x = player.x;
            graphics.y = player.y;

            graphics.rotation = player.body.velocity.x / 200 + Math.PI / 2;


            this.velocityX = player.body.velocity.x;
        });
    }

    sprite() {
        return this.player;
    }

    startShooting() {
        const playerBulletSize = 10;
        this.playerBullets = this.scene.physics.add.group();
        // every 100ms create a bullet
        this.scene.time.addEvent({
            delay: 100,
            callback: () => {
                const bullet = this.scene.add.ellipse(this.player.x, this.player.y, playerBulletSize, playerBulletSize, 0xcc99ff);
                this.physics.add.existing(bullet);
                bullet.body.setCircle(playerBulletSize, -playerBulletSize / 2, -playerBulletSize / 2);
                bullet.setDepth(1);
                bullet.speed = -6;
                bullet.angle = this.player.angle;

                this.playerBullets.add(bullet);
            },
            loop: true
        });

        // on update
        this.scene.events.on('update', () => {
            this.playerBullets.getChildren().forEach(bullet => {
                bullet.y += bullet.speed;
                // types of firing patterns
                // can fire from behind angle
                //   bullet.x += this.player.body.velocity.x / 50 * bullet.speed;
                // can fire directly up current position
                //   bullet.x += this.player.body.velocity.x / 50;
                // can fire in chaotic pattern
                //    bullet.x += this.player.body.velocity.x / 50 + Math.sin(bullet.angle) * 2;

                // fire in direction facing, early
                bullet.x += this.player.body.velocity.x / 50 * bullet.y / 500;

                if (bullet.y < 0) {
                    bullet.destroy();
                }
            });
        });
    }

    generateHeat() {
        // heat hitbox is a 50x30 square centered on the player
        const hitbox = this.physics.add.sprite(this.width / 2, this.height * 0.8, 'player');
        hitbox.setDisplaySize(90, 50);
        hitbox.setAlpha(0);

        // give it a circle graphic
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0x5577ff, 0);
        graphics.fillEllipse(0, 0, 90, 90);
        graphics.lineStyle(2, 0x0000ff, 1)
        graphics.strokeEllipse(0, 0, 90, 90);
        graphics.setAlpha(0);
        graphics.x = hitbox.x;
        graphics.y = hitbox.y;





        // if hitbox collides with any enemyBullet
        //collide
        this.physics.add.collider(hitbox, this.scene.bullets.enemyBullets, (player, bullet) => {
            if (bullet?.heatable) {;
                this.scene.ui.score += 1;
            }
            bullet.heatable = false;
            this.scene.ui.score += 8;


            graphics.setAlpha(1);
            this.scene.time.addEvent({
                delay: 100,
                callback: () => {
                    graphics.setAlpha(0);
                }
            });
        });

        

        // on update
        this.scene.events.on('update', () => {
            hitbox.x = this.player.x;
            hitbox.y = this.player.y;
            graphics.x = hitbox.x;
            graphics.y = hitbox.y;
        });


    }

    takeDamage() {
        for (let i = 0; i < 5; i++) {
            this.scene.time.addEvent({
                delay: 100 * i,
                callback: () => {
                    this.graphic.setAlpha(0);
                }
            });
            this.scene.time.addEvent({
                delay: 100 * i + 50,
                callback: () => {
                    this.graphic.setAlpha(1);
                }
            });
        }
    }
}