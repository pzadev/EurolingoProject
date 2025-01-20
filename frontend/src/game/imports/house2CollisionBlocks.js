export default class House2CollisionBlocks {
  constructor(scene) {
    this.scene = scene;
    this.House2CollisionBlocks = scene.physics.add.staticGroup();

    this.House2CollisionBlocks.create(285, 250, "collision")
      .setSize(10, 500)
      .setOrigin(1, 1)
      .setVisible(false);

    this.House2CollisionBlocks.create(530, 230, "collision")
      .setSize(500, 10)
      .setOrigin(1, 1)
      .setVisible(false);

    this.House2CollisionBlocks.create(530, 490, "collision")
      .setSize(500, 10)
      .setOrigin(1, 1)
      .setVisible(false);

    this.House2CollisionBlocks.create(320, 290, "collision")
      .setSize(50, 100)
      .setOrigin(1, 1)
      .setVisible(false);

    this.House2CollisionBlocks.create(425, 270, "collision")
      .setSize(125, 30)
      .setOrigin(1, 1)
      .setVisible(false);

    this.House2CollisionBlocks.create(680, 380, "collision")
      .setSize(50, 130)
      .setOrigin(1, 1)
      .setVisible(false);

    this.House2CollisionBlocks.create(615, 415, "collision")
      .setSize(40, 20)
      .setOrigin(1, 1)
      .setVisible(false);

    this.House2CollisionBlocks.create(535, 250, "collision")
      .setSize(45, 50)
      .setOrigin(1, 1)
      .setVisible(false);

    this.House2CollisionBlocks.create(315, 460, "collision")
      .setSize(40, 40)
      .setOrigin(1, 1)
      .setVisible(false);

      this.House2CollisionBlocks.create(684, 265, "collision")
      .setSize(35, 35)
      .setOrigin(1, 1)
      .setVisible(false);
  }
  getHouse2Blocks() {
    return this.House2CollisionBlocks;
  }
}
