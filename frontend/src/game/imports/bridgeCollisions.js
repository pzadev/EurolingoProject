export default class BridgeCollisions {
    constructor(scene) {
      this.scene = scene;
      this.bridgeCollisions = scene.physics.add.staticGroup();
  
      this.bridgeCollisions.create(390, 210, "collision")
        .setSize(10, 120)
        .setOrigin(1, 1)
        .setVisible(false);

        this.bridgeCollisions.create(627, 210, "collision")
        .setSize(10, 120)
        .setOrigin(1, 1)
        .setVisible(false);
  
        this.bridgeCollisions.create(390, 455, "collision")
        .setSize(10, 90)
        .setOrigin(1, 1)
        .setVisible(false);

        this.bridgeCollisions.create(620, 455, "collision")
        .setSize(10, 70)
        .setOrigin(1, 1)
        .setVisible(false);

        this.bridgeCollisions.create(645, 489, "collision")
        .setSize(30, 5)
        .setOrigin(1, 1)
        .setVisible(false);

        this.bridgeCollisions.create(420, 510, "collision")
        .setSize(45, 5)
        .setOrigin(1, 1)
        .setVisible(false);

        this.bridgeCollisions.create(445, 570, "collision")
        .setSize(10, 95)
        .setOrigin(1, 1)
        .setVisible(false);

        this.bridgeCollisions.create(670, 570, "collision")
        .setSize(10, 150)
        .setOrigin(1, 1)
        .setVisible(false);

        this.bridgeCollisions.create(775, 160, "collision")
        .setSize(5, 40)
        .setOrigin(1, 1)
        .setVisible(false);

        this.bridgeCollisions.create(823, 185, "collision")
        .setSize(100, 10)
        .setOrigin(1, 1)
        .setVisible(false);

        this.bridgeCollisions.create(1000, 185, "collision")
        .setSize(100, 10)
        .setOrigin(1, 1)
        .setVisible(false);

      this.bridgeCollisions.create(510, 280, "collision")
        .setSize(400, 10)
        .setOrigin(1, 1)
        .setVisible(false);

        this.bridgeCollisions.create(200, 145, "collision")
        .setSize(1150, 10)
        .setOrigin(1, 1)
        .setVisible(false);
  
      this.bridgeCollisions.create(510, 395, "collision")
        .setSize(400, 10)
        .setOrigin(1, 1)
        .setVisible(false);
    }
    getBridgeBlocks() {
      return this.bridgeCollisions;
    }
  }
  