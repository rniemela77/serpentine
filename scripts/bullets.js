// phaser js code for bullets
export default class Bullets {
    constructor(scene) {
        this.scene = scene;
        this.width = this.scene.width;
        this.height = this.scene.height;
        this.physics = this.scene.physics;
        this.bullets = this.scene.physics.add.group();
        this.enemyBullets = this.scene.physics.add.group();

        // on update
        this.scene.events.on('update', () => {
            //every bullet moves down
            this.enemyBullets.getChildren().forEach(bullet => {
                bullet.y += bullet.speed;
                if (bullet.y > this.height) {
                    bullet.y = 0;
                }
            });
        });
    }

    createRandomBullets() {
        for (let i = 0; i < 30; i++) {
            const xPos = Phaser.Math.Between(0, this.width);
            const yPos = Phaser.Math.Between(0, this.height);
            const bullet = this.physics.add.sprite(xPos, yPos, 'player');
            bullet.setTint(0xff0000);
            bullet.size = Math.random() * 10 + 5;
            bullet.body.setCircle(bullet.size, 0, 0);
            bullet.body.setOffset(0, 0);
            bullet.speed = Math.random() * 3 + 1;
            bullet.setCollideWorldBounds(true);

            this.enemyBullets.add(bullet);
        }
    }

    createRandomAstroids() {
        // create large asteroids
        for (let i = 0; i < 10; i++) {
            const xPos = Phaser.Math.Between(0, this.width);
            const yPos = Phaser.Math.Between(0, this.height);
            const asteroid = this.physics.add.sprite(xPos, yPos, 'player');
            asteroid.setTint(0xaaaaaa);
            asteroid.size = Math.random() * 150 + 100;
            asteroid.body.setCircle(asteroid.size, 0, 0);
            asteroid.speed = Math.random() * 1.5 + 0.5;
            asteroid.setCollideWorldBounds(true);

            this.enemyBullets.add(asteroid);
        }
    }

    createRowsBullets() {
        // fire rows of bullets
        for (let i = 0; i < 10; i++) {
            const xPos = i * this.width / 10;
            const yPos = 0;
            const bullet = this.physics.add.sprite(xPos, yPos, 'player');
            bullet.setTint(0x00ff00);
            bullet.size = 30;
            bullet.body.setCircle(bullet.size, 0, 0);
            bullet.speed = 2;
            bullet.setCollideWorldBounds(true);

            this.enemyBullets.add(bullet);
        }
    }
}