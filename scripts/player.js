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
        this.player.body.setCircle(8, 0, 0);
        this.player.body.setOffset(0, 0);
        player.setCollideWorldBounds(true); // Prevent player from going off-screen
        player.setDragX(70); // Apply horizontal drag for gliding effect

        // create an oval svg
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0x5577ff, 1);
        graphics.fillEllipse(0, 0, 32, 16);
        graphics.x = player.x;
        graphics.y = player.y;
        graphics.setDepth(1);
        graphics.setRotation(Math.PI / 2);


        // on update
        this.scene.events.on('update', () => {
            graphics.x = player.x;
            graphics.y = player.y;

            graphics.rotation = player.body.velocity.x / 200 + Math.PI / 2;


        });
    }

    sprite() {
        return this.player;
    }

    generateHeat() {
        // heat hitbox is a 50x30 square centered on the player
        const hitbox = this.physics.add.sprite(this.width / 2, this.height * 0.8, 'player');
        hitbox.setDisplaySize(60, 30);
        // hitbox.setAlpha(0);

        // on update
        this.scene.events.on('update', () => {
            hitbox.x = this.player.x;
            hitbox.y = this.player.y;

            // if hitbox is overlapping an enemy bullet
            // destroy the bullet
            this.scene.physics.overlap(hitbox, this.scene.bullets.enemyBullets, (player, bullet) => {
                this.scene.ui.score += 8;
            });
        });


    }
}