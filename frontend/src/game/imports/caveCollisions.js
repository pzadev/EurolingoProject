export default class CaveCollisions {
    constructor(scene) {
      this.scene = scene;
      this.caveCollisions = scene.physics.add.staticGroup();
  
      this.caveCollisions.create(245, 210, "collision")
        .setSize(5, 120)
        .setOrigin(1, 1)
        .setVisible(false);

        this.caveCollisions.create(770, 260, "collision")
        .setSize(5, 250)
        .setOrigin(1, 1)
        .setVisible(false);

        this.caveCollisions.create(375, 190, "collision")
        .setSize(280, 5)
        .setOrigin(1, 1)
        .setVisible(false);

        this.caveCollisions.create(680, 190, "collision")
        .setSize(166, 5)
        .setOrigin(1, 1)
        .setVisible(false);

        this.caveCollisions.create(685, 280, "collision")
        .setSize(140, 5)
        .setOrigin(1, 1)
        .setVisible(false);

        this.caveCollisions.create(685, 335, "collision")
        .setSize(140, 5)
        .setOrigin(1, 1)
        .setVisible(false);

        this.caveCollisions.create(365, 280, "collision")
        .setSize(270, 5)
        .setOrigin(1, 1)
        .setVisible(false);

        this.caveCollisions.create(365, 335, "collision")
        .setSize(270, 5)
        .setOrigin(1, 1)
        .setVisible(false);

        this.caveCollisions.create(495, 310, "collision")
        .setSize(5, 50)
        .setOrigin(1, 1)
        .setVisible(false);

        this.caveCollisions.create(618, 310, "collision")
        .setSize(5, 50)
        .setOrigin(1, 1)
        .setVisible(false);

        this.caveCollisions.create(770, 260, "collision")
        .setSize(5, 250)
        .setOrigin(1, 1)
        .setVisible(false);

        this.caveCollisions.create(695, 455, "collision")
        .setSize(5, 155)
        .setOrigin(1, 1)
        .setVisible(false);

        this.caveCollisions.create(420, 455, "collision")
        .setSize(5, 155)
        .setOrigin(1, 1)
        .setVisible(false);

        this.caveCollisions.create(454, 380, "collision")
        .setSize(75, 5)
        .setOrigin(1, 1)
        .setVisible(false);

        this.caveCollisions.create(660, 380, "collision")
        .setSize(70, 5)
        .setOrigin(1, 1)
        .setVisible(false);

        this.caveCollisions.create(400, 510, "collision")
        .setSize(500, 5)
        .setOrigin(1, 1)
        .setVisible(false);

        this.caveCollisions.create(142, 400, "collision")
        .setSize(5, 200)
        .setOrigin(1, 1)
        .setVisible(false);

        this.caveCollisions.create(195, 347, "collision")
        .setSize(100, 5)
        .setOrigin(1, 1)
        .setVisible(false);

        this.caveCollisions.create(820, 387, "collision")
        .setSize(100, 5)
        .setOrigin(1, 1)
        .setVisible(false);

        this.caveCollisions.create(875, 435, "collision")
        .setSize(5, 200)
        .setOrigin(1, 1)
        .setVisible(false);

        this.caveCollisions.create(920, 560, "collision")
        .setSize(5, 80)
        .setOrigin(1, 1)
        .setVisible(false);

        this.caveCollisions.create(650, 560, "collision")
        .setSize(5, 80)
        .setOrigin(1, 1)
        .setVisible(false);

        this.caveCollisions.create(670, 545, "collision")
        .setSize(70, 5)
        .setOrigin(1, 1)
        .setVisible(false);

        this.caveCollisions.create(670, 530, "collision")
        .setSize(70, 5)
        .setOrigin(1, 1)
        .setVisible(false);

        this.caveCollisions.create(905, 545, "collision")
        .setSize(70, 5)
        .setOrigin(1, 1)
        .setVisible(false);
  
    }
    getCaveBlocks() {
      return this.caveCollisions;
    }
  }
  