export default class Enemy {
    constructor(scene) {
        this.scene = scene;
        this.width = this.scene.width;
        this.height = this.scene.height;
        this.physics = this.scene.physics;
        this.bullets = this.scene.bullets;
        this.player = this.scene.player;


        this.enemies = this.physics.add.group();
        this.enemyBullets = this.scene.physics.add.group();

        this.bulletBehavior();
    }

    bulletBehavior() {
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
        return;
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

    create() {
        const enemyTypes = [
            {
                size: 400,
                color: 0x0000ff,
                health: 800,
                attackStyle: 1,
            },
            {
                size: 250,
                color: 0xff0000,
                health: 150,
                attackStyle: 2,
            },
            {
                size: 100,
                color: 0x00ff00,
                health: 10,
                attackStyle: 3,
            }
        ];

        const thisEnemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];

        const enemy = this.scene.add.ellipse(
            Math.random() * this.width,
            100,
            thisEnemyType.size,
            thisEnemyType.size,
        ).setFillStyle(thisEnemyType.color);

        enemy.originalColor = thisEnemyType.color;

        this.physics.add.existing(enemy);
        enemy.body.setCircle(thisEnemyType.size / 2, 0, 0);
        this.enemies.add(enemy);

        enemy.body.setVelocityX(Phaser.Math.Between(-100, 100));
        enemy.health = 100;

        enemy.healthBar = this.scene.add.rectangle(enemy.x, enemy.y, enemy.health, 2, 0xffffff);

        // collision
        this.physics.add.collider(enemy, this.player.playerBullets, (enemy, bullet) => {
            this.enemyHit(enemy);
            bullet.destroy();
        });

        // on update
        this.scene.events.on('update', () => {
            if (enemy.health <= 0) {
                enemy.destroy();
                enemy.healthBar.destroy();
                return;
            }

            enemy.healthBar.x = enemy.x;
            enemy.healthBar.y = enemy.y - enemy.height / 2 - 20;
            enemy.healthBar.width = enemy.health;

            // if (enemy.y > this.height / 2) return enemy.y = this.height / 2;
            enemy.body.setVelocityY(1 * enemy.health);
        });

        // collide with other enemies
        this.physics.add.collider(enemy, this.enemies, (enemy1, enemy2) => {
            enemy1.body.setVelocityX(-enemy1.body.velocity.x);
            enemy2.body.setVelocityX(-enemy2.body.velocity.x);
        });

        this.enemyShootA(enemy);

        return enemy;
    }

    enemyHit(enemy) {
        // enemy flashes white
        enemy.setFillStyle(0xffffff);
        this.scene.time.addEvent({
            delay: 100,
            callback: () => {
                enemy.setFillStyle(enemy.originalColor);
            }
        });

        enemy.health -= 10;
    }

    enemyShootA(enemy) {
        const options = {
            bulletStyle: {
                x: 0,
                y: 0,
                size: 2,
                speed: 3,
            },
            rings: 8,
            pos: { x: enemy.x, y: enemy.y },
            expand: false,
            numBullets: 3,
            radius: 16,
            rate: 100,
        }

        // create a ring
        this.bullets.ringExpand(options);
    }

    enemyShootB(enemy) {
        // shoot stream of bullets
        const options = {
            bulletStyle: {
                x: enemy.x,
                y: enemy.y,
                fillStyle: 0xff0000,
                size: 2,
                speed: 2.8,
            },
            posA: { x: enemy.x, y: enemy.y },
            posB: {
                x: this.player.sprite().x, y: this.player.sprite().y,


            },
            rate: 100,
            numBullets: 2,
        };

        this.bullets.sendLineToPosition(options);
    }

    enemyShootC(enemy) {
        // shoot stream of bullets
        const options = {
            bulletStyle: {
                x: enemy.x,
                y: enemy.y,
                fillStyle: 0xff0000,
                size: 1.4,
                speed: 2.5,
            },
            posA: { x: enemy.x, y: enemy.y },
            posB: {
                x: this.player.sprite().x, y: this.player.sprite().y,
            },
            rate: 100,
            numBullets: 8,
        };

        this.bullets.sendLineToPosition(options);
    }

    enemiesShoot() {
        // every 2 sec
        this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                this.enemies.getChildren().forEach(enemy => {
                    if (!enemy.active) return;

                    if (enemy.attackStyle === 1) {
                        this.enemyShootA(enemy);
                    } else if (enemy.attackStyle === 2) {
                        this.enemyShootB(enemy);
                    } else if (enemy.attackStyle === 3) {
                        this.enemyShootC(enemy);
                    }
                })
            },
            loop: true
        });
    }

    createEnemies() {
        const maxEnemies = 3;

        // create enemies
        this.scene.time.addEvent({
            delay: 300,
            callback: () => {
                if (this.enemies.getChildren().length >= maxEnemies) return;

                this.create();
            },
            loop: true
        });
    }
}