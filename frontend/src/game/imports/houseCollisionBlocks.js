export default class HouseCollisionBlocks {
  constructor(scene) {
    this.scene = scene;
    this.HouseCollisionBlocks = scene.physics.add.staticGroup();

    this.HouseCollisionBlocks.create(910, 600, "collision")
      .setSize(10, 50)
      .setOrigin(1, 1)
      .setVisible(false);
    this.HouseCollisionBlocks.create(510, 190, "collision")
      .setSize(400, 1)
      .setOrigin(1, 1)
      .setVisible(false);
    this.HouseCollisionBlocks.create(610, 375, "collision")
      .setSize(200, 1)
      .setOrigin(1, 1)
      .setVisible(false);
    this.HouseCollisionBlocks.create(348, 510, "collision")
      .setSize(250, 1)
      .setOrigin(1, 1)
      .setVisible(false);

    this.HouseCollisionBlocks.create(275, 300, "collision")
      .setSize(1, 500)
      .setOrigin(1, 1)
      .setVisible(false);

    this.HouseCollisionBlocks.create(505, 448, "collision")
      .setSize(1, 150)
      .setOrigin(1, 1)
      .setVisible(false);

    this.HouseCollisionBlocks.create(338, 485, "collision")
      .setSize(100, 30)
      .setOrigin(1, 1)
      .setVisible(false);

    this.HouseCollisionBlocks.create(300, 400, "collision")
      .setSize(40, 100)
      .setOrigin(1, 1)
      .setVisible(false);

    this.HouseCollisionBlocks.create(680, 280, "collision")
      .setSize(40, 120)
      .setOrigin(1, 1)
      .setVisible(false);
    this.HouseCollisionBlocks.create(570, 220, "collision")
      .setSize(130, 40)
      .setOrigin(1, 1)
      .setVisible(false);

    this.HouseCollisionBlocks.create(320, 225, "collision")
      .setSize(50, 50)
      .setOrigin(1, 1)
      .setVisible(false);

      this.HouseCollisionBlocks.create(390, 220, "collision")
      .setSize(40, 50)
      .setOrigin(1, 1)
      .setVisible(false);

      this.HouseCollisionBlocks.create(470, 485, "collision")
      .setSize(30, 30)
      .setOrigin(1, 1)
      .setVisible(false);
  }
  getHouseBlocks() {
    return this.HouseCollisionBlocks;
  }
}
