import Phaser from "phaser";
import CaveCollisions from "../imports/caveCollisions";
class CaveScene extends Phaser.Scene {
  constructor() {
    super({ key: "CaveScene" });
  }

  preload() {
    this.load.image("cave", "assets/cave.png", {
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

    this.game.sound.stopAll();

    const cave = this.add
      .image(0, 0, "cave")
      .setOrigin(0, 0)
      .setScale(1.587, 1.2); // How zoomed in the map is

    this.player = this.physics.add
      .sprite(535, 170, "guy")
      .setSize(18, 10)
      .setScale(2.2) // Size of character
      .setOrigin(0, 0) // Do not change
      .setOffset(6.5, 14); // Do not change

    this.teleport = this.physics.add.staticGroup();

    const teleport = this.teleport
      .create(555, 170, "collision")
      .setSize(20, 20)
      .setOrigin(1, 1);
    teleport.visible = false;
    teleport.setData("targetScene", "BridgeScene");
    teleport.setData("startX", 600);
    teleport.setData("startY", 400);

    this.physics.add.overlap(
      this.player,
      this.teleport,
      (player, teleport) => {
        const targetScene = teleport.getData("targetScene");
        const startX = teleport.getData("startX");
        const startY = teleport.getData("startY");

        if (targetScene) {
          this.scene.start(targetScene, { startX, startY });
        }
      },
      null,
      this
    );

    const caveBlocks = new CaveCollisions(this);
    const caveCollisionGroup = caveBlocks.getCaveBlocks();
    this.physics.add.collider(this.player, caveCollisionGroup);

    this.player.setCollideWorldBounds(true);

    this.lighting = this.make.graphics({ x: 0, y: 0, add: false });
    this.lighting.fillStyle(0x000000, 0.9);

    this.mask = this.lighting.createGeometryMask();
    cave.setMask(this.mask);

    this.lightRadius = 75;
  }

  update() {
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-130);
      this.player.anims.play("right", true);
      this.player.setFlipX(true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(130);
      this.player.anims.play("right", true);
      this.player.setFlipX(false);
    }

    if (this.player.body.velocity.x === 0) {
      if (this.cursors.up.isDown) {
        this.player.setVelocityY(-130);
        this.player.anims.play("up", true);
      } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(130);
        this.player.anims.play("down", true);
      }
    }

    if (
      this.player.body.velocity.x === 0 &&
      this.player.body.velocity.y === 0
    ) {
      this.player.anims.play("guyidle", true);
    }

    this.lighting.clear();
    this.lighting.fillStyle(0x000000, 0.9);
    this.lighting.fillCircle(
      this.player.x + this.player.width + 5 / 1.6,
      this.player.y + this.player.height + 5 / 1.6,
      this.lightRadius
    );
  }
}

export default CaveScene;
