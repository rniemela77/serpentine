export default class Movement {
    constructor(scene) {
        this.scene = scene;
        this.player = this.scene.player;
        this.input = this.scene.input;

        // on update
        this.scene.events.on('update', () => {
            const player = this.player.sprite();
            const cursors = this.input.keyboard.createCursorKeys();

            const maxSpeed = 500; // Maximum speed the player can move
            const rate = 4; // Rate at which the player moves

            const keyADown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A).isDown;
            const keyDDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D).isDown;

            // Handle player movement
            const leftArrowDown = cursors.left.isDown;
            const rightArrowDown = cursors.right.isDown;
            if (leftArrowDown || keyADown) {
                player.setVelocityX(
                    player.body.velocity.x > -maxSpeed ? player.body.velocity.x - rate : -maxSpeed
                );
            } else if (rightArrowDown || keyDDown) {
                player.setVelocityX(
                    player.body.velocity.x < maxSpeed ? player.body.velocity.x + rate : maxSpeed
                );
            }

            player.rotation = player.body.velocity.x / 1000;
        });
    }
}