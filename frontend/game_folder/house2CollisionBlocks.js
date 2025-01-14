export default class House2CollisionBlocks {
    constructor(scene) {
      this.scene = scene;
      this.House2CollisionBlocks = scene.physics.add.staticGroup();

      this.House2CollisionBlocks.create(55, 250, "collision")
      .setSize(10, 500)
      .setOrigin(1, 1)
      .setVisible(false);

      this.House2CollisionBlocks.create(300, 230, "collision")
      .setSize(500, 10)
      .setOrigin(1, 1)
      .setVisible(false);

      this.House2CollisionBlocks.create(300, 475, "collision")
      .setSize(500, 10)
      .setOrigin(1, 1)
      .setVisible(false);


    }
      getHouse2Blocks() {
        return this.House2CollisionBlocks;
      }
    }