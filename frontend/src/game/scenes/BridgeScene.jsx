import Phaser from "phaser";
import BridgeCollisions from "../imports/bridgeCollisions";

class BridgeScene extends Phaser.Scene {
  constructor() {
    super({ key: "BridgeScene" });
    this.selectedLanguage = null;
  }

  init(data) {
    this.startX = data && data.x ? data.x : 150; // Default to 100 if no position passed
    this.startY = data && data.y ? data.y : 400; // Default to 400 if no position passed
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
    this.load.audio("waterfall", "/assets/waterfall.mp3");
    this.load.image("speech", "game_folder/assets/Speech Bubble.png");
    this.load.image("gerFlag", "assets/gerFlag.png");
    this.load.image("spaFlag", "assets/spaFlag.png");
    this.load.image("ukrFlag", "assets/ukrFlag.png");
    this.load.image("itaFlag", "assets/itaFlag.png");
    this.load.image("freFlag", "assets/freFlag.png");
  }

  create() {
    this.game.sound.stopAll();
    this.cursors = this.input.keyboard.createCursorKeys();

    const waterfall = this.sound.add("waterfall", {
      loop: true,
      volume: 0.03,
    });

    waterfall.play();

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
    teleport.visible = false;
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
            selectedLanguage: this.selectedLanguage,
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

    this.characterZone = this.physics.add.staticGroup();
    const characterTrigger = this.characterZone
      .create(550, 300, "collision") // Position it slightly to the right and central
      .setSize(150, 100) // Size of the trigger zone
      .setOrigin(0.5, 0.5);
    characterTrigger.visible = false; // Make the collision area invisible

    // Add overlap detection for player and the trigger zone
    this.physics.add.overlap(
      this.player,
      this.characterZone,
      this.handleCharacterInteraction, // Callback function for interaction
      null,
      this
    );
  }

  handleCharacterInteraction(player, zone) {
    if (this.reminder && this.speech) {
      this.reminder.destroy();
      this.speech.destroy();
    }

    this.speech = this.add.image(600, 200, "speech").setScale(0.21).setDepth(9);
    this.reminder = this.add
      .text(
        439,
        135,
        `Well done on getting this far!\nFor your final task, select\na language, and then\nhead over to the cave.`,
        {
          fontSize: "17px",
          color: "#ffffff",
          align: "center",
          padding: { x: 10, y: 5 },
        }
      )
      .setDepth(10);

    this.time.delayedCall(5000, () => {
      if (this.reminder && this.speech) {
        this.reminder.destroy();
        this.speech.destroy();
        this.reminder = null;

        this.displayFlags();
      }
    });

    zone.destroy();
  }

  displayFlags() {
    const flagPositions = [
      { key: "gerFlag", x: 330, y: 370, language: "german" },
      { key: "spaFlag", x: 420, y: 370, language: "spanish" },
      { key: "ukrFlag", x: 510, y: 370, language: "ukrainian" },
      { key: "itaFlag", x: 600, y: 370, language: "italian" },
      { key: "freFlag", x: 690, y: 370, language: "french" },
    ];

    flagPositions.forEach((flag) => {
      const flagSprite = this.add
        .image(flag.x, flag.y, flag.key)
        .setScale(0.8)
        .setInteractive()
        .on("pointerdown", () => {
          this.handleFlagClick(flag.language);
        });
    });
  }

  handleFlagClick(language) {
    this.selectedLanguage = language;

    this.children.getAll().forEach((child) => {
      if (child && child.texture && child.texture.key.includes("Flag")) {
        child.setVisible(false);
      }
    });
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
