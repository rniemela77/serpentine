export default class Background {
    constructor(scene) {
        this.scene = scene;
        // return;


        // create a grid as the background
        const graphics = this.scene.add.graphics();
        graphics.lineStyle(2, 0x333333, 0.3);
        const gridCells = 8;
        const gridWidth = scene.width / gridCells;
        const gridHeight = scene.height / gridCells;
        this.mapGridHeight = gridHeight;

        for (let i = 0; i < gridCells; i++) {
            graphics.moveTo(i * gridWidth, 0);
            graphics.lineTo(i * gridWidth, scene.height);
            graphics.moveTo(0, i * gridHeight);
            graphics.lineTo(scene.width, i * gridHeight);
        }

        graphics.strokePath();

        this.mapGrid = graphics;

        // on update
        this.scene.events.on('update', () => {
            // grid is constantly moving down
            this.mapGrid.y += 3;

            if (this.mapGrid.y >= this.mapGridHeight) {
                this.mapGrid.y = 0;
            }
        });
    }
}