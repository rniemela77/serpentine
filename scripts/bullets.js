// phaser js code for bullets
export default class Bullets {
    constructor(scene) {
        this.scene = scene;
        this.time = this.scene.time;
        this.width = this.scene.width;
        this.height = this.scene.height;
        this.physics = this.scene.physics;
        this.player = this.scene.player;
        this.bullets = this.scene.physics.add.group();
        this.enemyBullets = this.scene.physics.add.group();

        this.referencePoint = 0;

        this.center = { x: this.width / 2, y: this.height / 2 };
        this.left = { x: this.width / 3, y: this.height / 2 };
        this.right = { x: this.width * 2 / 3, y: this.height / 2 };
        // on update
        this.scene.events.on('update', () => {
            // if player is moving
            if (this.player.velocityX) {
                this.referencePoint -= this.player.velocityX / 50;
            }

            
            if (this.referencePoint > this.width) {
                this.referencePoint = 0;
            } else if (this.referencePoint < 0) {
                this.referencePoint = this.width;
            }

            // right reference point is 0
            // something wonky here. right refernece point jumps.
            this.left = { x: this.referencePoint, y: this.height / 2 };
            this.center = { x: this.referencePoint - this.width / 3, y: this.height / 2 };
            this.right = { x: this.referencePoint + this.width / 3, y: this.height / 2 };

            // put dots at center left right
            if (this.c1) {
                this.c1.destroy();
                this.c2.destroy();
                this.c3.destroy();
            }
            this.c2 = this.scene.add.ellipse(this.center.x, this.center.y, 30, 30, 0xffffff);
            this.c1 = this.scene.add.ellipse(this.left.x, this.left.y, 20, 20, 0xff3333);
            this.c3 = this.scene.add.ellipse(this.right.x, this.right.y, 10, 10, 0xff55555);

            //every bullet moves down
            this.enemyBullets.getChildren().forEach(bullet => {
                const { speed, direction } = bullet;
                bullet.x += speed * Math.cos(direction);
                bullet.y += speed * Math.sin(direction);
                bullet.rotation = direction + Math.PI / 2;

                // bullet.y += 2;

                // if bullet is not visible
                if (bullet.x < 0 || bullet.x > this.width || bullet.y > this.height || bullet.y < 0) {
                    bullet.destroy();
                }

                // if bullet goes off screen
                if (bullet.y > this.height || bullet.y < 0) {
                    bullet.destroy();
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

    ringExpand(
        options
    ) {
        let { bulletStyle, rings, pos, expand, numBullets, radius, rate } = options;
        pos = pos || { x: this.width / 2, y: this.height / 2 };
        expand = expand || false;
        numBullets = numBullets || 15;
        radius = radius || 100;
        rate = rate || 100;

        for (let i = 0; i < rings; i++) {
            this.time.addEvent({
                delay: rate * i,
                callback: () => {
                    // create a ring of bullets expanding outwards
                    for (let j = 0; j < numBullets; j++) {
                        const angle = (j / numBullets) * Math.PI * 2;
                        const xPos = pos.x + radius * Math.cos(angle);
                        const yPos = pos.y + radius * Math.sin(angle);

                        const bullet = this.create(
                            { x: xPos, y: yPos },
                            angle,
                            expand ? bulletStyle.size * i + 1 : bulletStyle.size,
                            bulletStyle.color,
                            bulletStyle?.strokeColor
                        );
                        bullet.speed = bulletStyle.speed;
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

    sendLineToPosition(
        options
    ) {
        let { bulletStyle, posA, posB, numBullets, rate } = options;
        posA = posA || { x: this.width / 2, y: this.height / 2 };
        posB = posB || { x: this.player.sprite().x, y: this.player.sprite().y };
        numBullets = numBullets || 10;
        rate = rate || 100;

        // create a stream of bullets toward the player
        for (let i = 0; i < numBullets; i++) {
            this.time.addEvent({
                delay: rate * i,
                callback: () => {
                    // shoot from posA to posB
                    const bullet = this.create(posA, 0, bulletStyle.size, bulletStyle.color);
                    bullet.speed = bulletStyle.speed;
                    bullet.direction = Math.atan2(posB.y - posA.y, posB.x - posA.x);
                },
            });
        }
    }

    patternC() {
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                const options = {
                    bulletStyle: {
                        x: 0,
                        y: 0,
                        size: 2,
                        speed: 3,
                    },
                    rings: 1,
                    pos: this.right,
                    expand: false,
                    numBullets: 8,
                    radius: 16,
                    rate: 200,
                }

                // create a ring
                this.ringExpand(options);
            },
            loop: true,
        });
    }

    patternD() {
        const areas = [
            this.left, this.right
        ]
        areas.forEach((pos) => {
            this.time.addEvent({
                delay: 1200,
                callback: () => {
                    const options = {
                        bulletStyle: {
                            x: 0,
                            y: 0,
                            size: 0.8,
                            speed: 2,
                        },
                        // posA
                        posA: pos,
                        posB: {
                            x: this.player.sprite().x,
                            y: this.player.sprite().y
                        },
                        // numBullets
                        numBullets: 3,
                        // rate
                        rate: 200,
                    }

                    // create a ring
                    this.sendLineToPosition(options);
                },
                loop: true,
            });
        })
    }

    create(
        pos = { x: this.width / 2, y: this.height / 2 },
        direction = 0,
        size = 1,
        color = 0xffffff,
        strokeColor = 0xff0000
    ) {
        size = 20 * size;
        const oval = false;
        const vertSize = oval ? size * 2 : size;
        const bullet = this.scene.add.ellipse(pos.x, pos.y, size, vertSize, color);
        const hitboxSize = size / 2;
        this.physics.add.existing(bullet);
        bullet.body.setCircle(hitboxSize, -hitboxSize / 2, -hitboxSize / 2);
        bullet.body.setOffset(0, 0);
        bullet.setStrokeStyle(2, strokeColor);
        bullet.direction = direction;
        this.enemyBullets.add(bullet);

        // if player touches bullet
        this.physics.add.overlap(this.player.sprite(), bullet, () => {
            bullet.destroy();
            this.player.takeDamage();
        });

        return bullet;
    }


    streams() {
        const center = { x: this.width / 2, y: this.height / 2 };
        this.time.addEvent({
            delay: 500,
            callback: () => {
                const playerPos = { x: this.player.sprite().x, y: this.player.sprite().y };
                this.streamTowardPosition(center, playerPos, 1.5, 20)
            },
            loop: true,
        });
    }

    attackStreams() {
        // only works on odd number of streams
        const numberOfStreams = 3;
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
                    this.streamTowardPosition(center, pos);
                });
            },
            loop: true,
        });
    }

    leftAndRightSpiral() {
        // left and right rings
        const leftCenter = { x: this.width / 3, y: this.height / 2 };
        const rightCenter = { x: this.width * 2 / 3, y: this.height / 2 };
        this.rotatingRing(leftCenter, 0.5, 3, 2, 1);
        this.rotatingRing(rightCenter, 0.5, 3, 2, -1);
    }

}