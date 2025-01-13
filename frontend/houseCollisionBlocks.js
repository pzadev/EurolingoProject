export default class HouseCollisionBlocks {
    constructor(scene) {
      this.scene = scene;
      this.collisionBlocks = scene.physics.add.staticGroup();

       this.collisionBlocks
      .create(690, 600, "collision")
      .setSize(10, 50)
      .setOrigin(1, 1)
      .setVisible(false);
    this.collisionBlocks
      .create(600, 600, "collision")
      .setSize(50, 1)
      .setOrigin(1, 1)
      .setVisible(false);
    }
      getHouseBlocks() {
        return this.collisionBlocks;
  
  }
  }
