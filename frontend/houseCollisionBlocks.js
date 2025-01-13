export default class HouseCollisionBlocks {
  constructor(scene) {
    this.scene = scene;
    this.HouseCollisionBlocks = scene.physics.add.staticGroup();

    this.HouseCollisionBlocks.create(690, 600, "collision")
      .setSize(10, 50)
      .setOrigin(1, 1)
      .setVisible(false);
    this.HouseCollisionBlocks.create(300, 190, "collision")
      .setSize(400, 1)
      .setOrigin(1, 1)
      .setVisible(false);
    this.HouseCollisionBlocks.create(400, 365, "collision")
      .setSize(200, 1)
      .setOrigin(1, 1)
      .setVisible(false);
    this.HouseCollisionBlocks.create(190, 510, "collision")
      .setSize(250, 1)
      .setOrigin(1, 1)
      .setVisible(false);

    this.HouseCollisionBlocks.create(65, 300, "collision")
      .setSize(1, 500)
      .setOrigin(1, 1)
      .setVisible(false);

      this.HouseCollisionBlocks.create(295, 440, "collision")
      .setSize(1, 150)
      .setOrigin(1, 1)
      .setVisible(false);
  }
  getHouseBlocks() {
    return this.HouseCollisionBlocks;
  }
}
