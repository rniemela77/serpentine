export default class Player {
    constructor(scene) {
        this.scene = scene;
        this.width = this.scene.width;
        this.height = this.scene.height;
        this.physics = this.scene.physics;


        const player = this.physics.add.sprite(this.width / 2, this.height * 0.8, ''); // Adjust position and sprite name
        this.player = player;
        this.player.body.setCircle(16, 0, 0);
        this.player.body.setOffset(0, 0);
        player.setCollideWorldBounds(true); // Prevent player from going off-screen
        player.setDragX(70); // Apply horizontal drag for gliding effect

        return this.player;
    }

    sprite() {
        return this.player;
    }
}