import Phaser from "phaser";
import BridgeCollisions from "../imports/bridgeCollisions";

class BridgeScene extends Phaser.Scene {
  constructor() {
    super({ key: "BridgeScene" });
  }

  preload() {
    this.load.spritesheet("bridge", "assets/bridge.png", {
      frameWidth: 630,
      frameHeight: 500,
    });
    this.load.spritesheet("guy", "assets/guy.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.image("collision", "assets/collision.png");
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();


    this.anims.create({
      key: "bridge",
      frames: this.anims.generateFrameNumbers("bridge", {
        start: 0,
        end: 14,
      }),
      frameRate: 8,
      repeat: -1, // Loops through indefinitely
    });

    const bridge = this.add
      .sprite(0, 0, "bridge")
      .setOrigin(0, 0)
      .setScale(1.587, 1.2); // How zoomed in the map is

    this.player = this.physics.add
      .sprite(50, 280, "guy")
      .setSize(18, 10)
      .setScale(3) // Size of character
      .setOrigin(0, 0) // Do not change
      .setOffset(6.5, 14); // Do not change

    this.player.setCollideWorldBounds(true);

    this.teleport = this.physics.add.staticGroup();

    const teleport = this.teleport
      .create(910, 150, "collision")
      .setSize(30, 40)
      .setOrigin(1, 1);
    teleport.visible = true;
    teleport.setData("targetScene", "CaveScene");

    const teleport2 = this.teleport
      .create(0, 340, "collision")
      .setSize(30, 20)
      .setOrigin(1, 1);
    teleport2.visible = true;
    teleport2.setData("targetScene", "Main");
    teleport2.setData("targetX", 1900);
    teleport2.setData("targetY", 800);
    this.physics.add.overlap(
      this.player,
      this.teleport,
      (player, teleport) => {
        const targetScene = teleport.getData("targetScene");
        if (targetScene) {
          this.scene.start(targetScene, {
            targetX: teleport.getData("targetX"),
            targetY: teleport.getData("targetY"),
          });
        }
      },
      null,
      this
    );
    bridge.play("bridge");


    // House collision and door data for HouseScene
    const bridgeBlocks = new BridgeCollisions(this);
    const bridgeCollisionGroup = bridgeBlocks.getBridgeBlocks();
    this.physics.add.collider(this.player, bridgeCollisionGroup);
  }

  update() {
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("right", true);
      this.player.setFlipX(true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("right", true);
      this.player.setFlipX(false);
    }

    if (this.player.body.velocity.x === 0) {
      if (this.cursors.up.isDown) {
        this.player.setVelocityY(-160);
        this.player.anims.play("up", true);
      } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(160);
        this.player.anims.play("down", true);
      }
    }

    if (
      this.player.body.velocity.x === 0 &&
      this.player.body.velocity.y === 0
    ) {
      this.player.anims.play("guyidle", true);
    }
  }
}

export default BridgeScene;
