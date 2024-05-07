// phaser js code for bullets
export default class Bullets {
    constructor(scene) {
        this.scene = scene;
        this.time = this.scene.time;
        this.width = this.scene.width;
        this.height = this.scene.height;
        this.physics = this.scene.physics;
        this.bullets = this.scene.physics.add.group();
        this.enemyBullets = this.scene.physics.add.group();

        // on update
        this.scene.events.on('update', () => {
            //every bullet moves down
            this.enemyBullets.getChildren().forEach(bullet => {
                const { speed, direction } = bullet;
                bullet.x += speed * Math.cos(direction);
                bullet.y += speed * Math.sin(direction);
                bullet.rotation = direction + Math.PI / 2;
                // bullet.y += bullet.speed;
                // if (bullet.y > this.height) {
                //     bullet.y = 0;
                // }
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

    createLine(posA, posB) {
        // create a line connecting posA to posB
        const line = new Phaser.Geom.Line(posA.x, posA.y, posB.x, posB.y);
        const points = line.getPoints(30);

        points.forEach(point => {
            const bullet = this.physics.add.sprite(point.x, point.y, 'player');
            bullet.setTint(0xff0000);
            bullet.size = 10;
            bullet.body.setCircle(bullet.size, 0, 0);
            bullet.body.setOffset(0, 0);
            bullet.speed = 3;
            bullet.direction = Math.atan2(posB.y - posA.y, posB.x - posA.x);
            bullet.setCollideWorldBounds(true);
            this.enemyBullets.add(bullet);
        });
    }

    shootLine(posA, posB) {
        // create a line connecting posA to posB
        const line = new Phaser.Geom.Line(posA.x, posA.y, posB.x, posB.y);
        const points = line.getPoints(30);

        points.forEach(point => {
            const bullet = this.physics.add.sprite(point.x, point.y, 'player');
            bullet.setTint(0xff0000);
            bullet.size = 10;
            bullet.body.setCircle(bullet.size, 0, 0);
            bullet.body.setOffset(0, 0);
            bullet.speed = 3;
            bullet.direction = Math.atan2(posB.y - posA.y, posB.x - posA.x);
            bullet.setCollideWorldBounds(true);

            this.enemyBullets.add(bullet);
        });

    }

    createRow(bulletSize = 30, bulletSpeed = 4, rowSize = 10, angle = Math.PI / 2) {

        // fire rows of bullets
        for (let i = 0; i < rowSize; i++) {
            const angle = Math.PI / 2;
            const xPos = i * this.width / rowSize;
            const yPos = this.height / 2 - 200;

            // Add the ellipse object to the scene
            const bullet = this.scene.add.ellipse(xPos, yPos, bulletSize, bulletSize, 0xff0000);
            this.physics.add.existing(bullet);
            bullet.speed = bulletSpeed;
            bullet.body.setCircle(bulletSize, 0, 0);
            bullet.direction = angle;

            this.enemyBullets.add(bullet);
        }
    }

    createPatternA() {
        const speed = 2;
        const iMax = 50;
        const size = 14;
        for (let i = 1; i < iMax; i++) {
            this.time.addEvent({
                delay: 100 * i,
                callback: () => {
                    const minRows = 5;
                    const angle = 5;
                    const a = (i / angle) + minRows;
                    const b = ((iMax - i) / angle) + minRows;


                    // mirror it
                    if (i < iMax / 2) {
                        this.createRow(size, speed, a, Math.PI / 2);
                    }
                    else {
                        this.createRow(size, speed, b, Math.PI / 2);
                    }
                },
            });
        };
    }

    createPatternB() {
        for (let i = 0; i < 50; i++) {
            this.time.addEvent({
                delay: 100 * i,
                callback: () => {
                    const defaultAngle = 2;
                    const aAngle = defaultAngle + 0.5 + i;
                    const bAngle = defaultAngle - 0.5 + i;
                    this.createRow(30, 3, 6, Math.PI / aAngle);
                    this.createRow(30, 3, 6, Math.PI / bAngle);
                },
            });
        }
    }

    ringExpand() {
        const center = { x: this.width / 2, y: this.height / 2 };

        for (let i = 0; i < 5; i++) {
            this.time.addEvent({
                delay: 150 * i,
                callback: () => {
                    // create a ring of bullets expanding outwards
                    const radius = 100;
                    const numBullets = 15;
                    for (let i = 0; i < numBullets; i++) {
                        const angle = (i / numBullets) * Math.PI * 2;
                        const xPos = center.x + radius * Math.cos(angle);
                        const yPos = center.y + radius * Math.sin(angle);

                        const bullet = this.create({ x: xPos, y: yPos }, angle);
                        bullet.speed = 2;
                        bullet.direction = angle;
                    }
                },
            });
        }
    }

    createSpiral() {
        const randomAngle = Math.random() * Math.PI * 2;
        const center = { x: this.width / 2, y: this.height / 2 };
        const absurdity = 3;

        for (let i = 1; i < 50; i++) {
            this.time.addEvent({
                delay: 100 * i,
                callback: () => {
                    const radius = 100;
                    const numBullets = 20;
                    for (let i = 0; i < numBullets; i++) {
                        const angle = (i / numBullets) * Math.PI * 2;
                        const xPos = center.x + radius * Math.cos(angle);
                        const yPos = center.y + radius * Math.sin(angle);

                        const bullet = this.create({ x: xPos, y: yPos }, angle);
                        bullet.speed = 2 + i / absurdity * 0.2;
                        bullet.direction = randomAngle + i / absurdity;
                    }
                },
            });
        }
    }

    rotatingRing(pos, radius, numBullets, speed, twist) {
        // every 50ms, create a ring
        for (let i = 0; i < 50; i++) {
            this.time.addEvent({
                delay: 150 * i,
                callback: () => {
                    // const expandingRadius = 10 * i / 10;
                    // const radius = expandingRadius;
                    // const rotation = i / 10 * Math.PI / 2; // star pattern
                    const rotation = i / twist;
                    this.createRing(pos, radius, numBullets, speed, rotation);
                },
            });
        }
    }

    rotatingSpiral(pos, radius, numBullets, speed) {
        // every 50ms, create a ring
        for (let i = 1; i < 50; i++) {
            this.time.addEvent({
                delay: 90 * i,
                callback: () => {
                    // const expandingRadius = 10 * i / 10;
                    // const radius = expandingRadius;
                    const radius = 1;
                    const rotation = i / 10 * Math.PI / 2; // star pattern
                    this.createRing(pos, radius, 3, speed, rotation);
                },
            });
        }
    }

    createRing(
        pos = { x: this.width / 2, y: this.height / 2 },
        radius = 100,
        numBullets = 15,
        speed = 2,
        rotation = 0
    ) {
        for (let i = 0; i < numBullets; i++) {
            const angle = (i / numBullets) * Math.PI * 2;
            const xPos = pos.x + radius * Math.cos(angle);
            const yPos = pos.y + radius * Math.sin(angle);

            const bullet = this.create({ x: xPos, y: yPos }, angle);
            bullet.speed = speed;
            bullet.direction = angle + rotation;
        }
    }

    streamTowardPosition(
        posA,
        posB,
        speed = 1.5,
        numBullets = 20,
        rate = 100
    ) {
        // create a stream of bullets toward the player
        for (let i = 1; i < numBullets; i++) {
            this.time.addEvent({
                delay: rate * i,
                callback: () => {
                    // shoot from posA to posB
                    const bullet = this.create(posA, 0, 0.5);
                    bullet.speed = speed;
                    bullet.direction = Math.atan2(posB.y - posA.y, posB.x - posA.x);
                },
            });
        }
    }

    create(
        pos,
        direction,
        size = 1,
        // color = Math.random() * 0xffffff,
        color = 0xffffff,
        strokeColor = 0xff0000
    ) {
        size = 15 * size;
        const bullet = this.scene.add.ellipse(pos.x, pos.y, size, size * 2, color);
        this.physics.add.existing(bullet);
        bullet.body.setCircle(10, 0, 0);
        bullet.setStrokeStyle(3, strokeColor);
        bullet.body.setOffset(0, 0);
        bullet.direction = direction;
        this.enemyBullets.add(bullet);

        return bullet;
    }
}