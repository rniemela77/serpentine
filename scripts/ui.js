export default class UI {
    constructor(scene) {
        this.scene = scene;
        this.width = this.scene.width;
        this.height = this.scene.height;
        this.physics = this.scene.physics;
        
        // create a floating ui
        this.scoreText = this.scene.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#fff' });
        this.score = 0;
        this.scoreText.setScrollFactor(0);
        this.scoreText.setDepth(1);

        // on update
        this.scene.events.on('update', () => {
            this.scoreText.setText('score: ' + this.score);

            // place the score text in the top left corner
            this.scoreText.x = this.scene.width * 0.3;
            this.scoreText.y = this.scene.height * 0.7;
        });

        // return this.player;
    }
}