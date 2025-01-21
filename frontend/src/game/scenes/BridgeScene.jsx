import Phaser from "phaser";
import BridgeCollisions from "../imports/bridgeCollisions";

class BridgeScene extends Phaser.Scene {
  constructor() {
    super({ key: "BridgeScene" });
    this.scrambledWord = null; // Store the scrambled word text object
    this.correctWord = ""; // The correct word for validation
    this.inputLetters = []; // Store draggable letter objects
  }

  init(data) {
    this.startX = data && data.x ? data.x : 100; // Default to 100 if no position passed
    this.startY = data && data.y ? data.y : 275; // Default to 400 if no position passed
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

    // Assets for the chest feature
    this.load.spritesheet("chest", "game_folder/assets/Chest_Anim.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.image("exMark", "game_folder/assets/Look_At_Me.png"); // Exclamation mark image
  }

  create() {
    this.game.sound.stopAll();
    this.cursors = this.input.keyboard.createCursorKeys();

    const waterfall = this.sound.add("waterfall", {
      loop: true,
      volume: 0.2,
    });

    waterfall.play();

    this.anims.create({
      key: "bridge",
      frames: this.anims.generateFrameNumbers("bridge", {
        start: 0,
        end: 14,
      }),
      frameRate: 8,
      repeat: -1,
    });

    const bridge = this.add
      .sprite(0, 0, "bridge")
      .setOrigin(0, 0)
      .setScale(1.587, 1.2); 

    this.player = this.physics.add
      .sprite(this.startX, this.startY, "player")
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
          });
        }
      },
      null,
      this
    );
    bridge.play("bridge");

    this.bridgeBlock = this.physics.add.staticSprite(350, 335, "collision")
      .setSize(10, 125) // Adjust size and position as needed
      .setOrigin(1, 1)
      .setVisible(false); // Make it invisible but still active for collision

    // Add collision with the player
    this.physics.add.collider(this.player, this.bridgeBlock);

    // Bridge collision data
    const bridgeBlocks = new BridgeCollisions(this);
    const bridgeCollisionGroup = bridgeBlocks.getBridgeBlocks();
    this.physics.add.collider(this.player, bridgeCollisionGroup);

    // Add chest with exclamation mark
    this.chestOpened = false;
    this.chest = this.physics.add.staticSprite(280, 260, "chest")
      .setScale(4)
      .refreshBody();
    this.exMark = this.physics.add.staticSprite(280, 260, "exMark")
      .setScale(0.06)
      .refreshBody();

    this.anims.create({
      key: "openChest",
      frames: this.anims.generateFrameNumbers("chest", { start: 0, end: 5 }),
      frameRate: 8,
      repeat: 0,
    });

    this.physics.add.collider(this.player, this.chest, this.openChest, null, this);

    // Timer to check word order every 3 seconds
    this.wordCheckTimer = this.time.addEvent({
      delay: 5000, // 3 seconds
      callback: this.checkWordOrder,
      callbackScope: this,
      loop: true,
    });
  }

  openChest(player, chest) {
    if (!this.chestOpened) {
      this.chestOpened = true;
      chest.anims.play("openChest", true);
      console.log("Chest opened!");
      this.exMark.destroy(); // Remove the exclamation mark
      this.triggerWordScrambling(); // Trigger the word scrambling
    }
  }

  triggerWordScrambling() {
    console.log("Fetching scrambled word...");
    const languageEndpoints = [
      "https://eurolingo.onrender.com/api/french",
      "https://eurolingo.onrender.com/api/ukrainian",
      "https://eurolingo.onrender.com/api/italian",
      "https://eurolingo.onrender.com/api/german",
      "https://eurolingo.onrender.com/api/spanish",
    ];
    const randomEndpoint = Phaser.Utils.Array.GetRandom(languageEndpoints);

    console.log("Selected API endpoint:", randomEndpoint);

    fetch(randomEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data);

        if (!data || !Array.isArray(data) || data.length === 0) {
          throw new Error("No valid data received from API");
        }

        const randomWord = this.getRandomWord(data);
        this.correctWord = randomWord.word;

        console.log("Original Word:", this.correctWord);

        if (!this.correctWord) {
          console.error("No valid word found!");
          return;
        }

        const scrambled = this.shuffleWord(this.correctWord);
        this.displayScrambledWord(scrambled);
      })
      .catch((error) => {
        console.error("Error fetching word:", error);
      });
  }

  displayScrambledWord(scrambled) {
    console.log("Displaying scrambled word:", scrambled);
    const totalWidth = scrambled.length * 40;
    let startX = this.scale.width / 2 - totalWidth / 2;
    let startY = this.scale.height / 2;

    scrambled.split("").forEach((letter) => {
      const letterText = this.add.text(startX, startY, letter, {
        fontSize: "32px",
        color: "#FFFFFF",
      })
        .setInteractive()
        .setDepth(5);
      this.input.setDraggable(letterText);
      this.inputLetters.push(letterText);
      startX += 40;
    });

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });
  }

  shuffleWord(word) {
    const array = word.split("");
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join("");
  }

  getRandomWord(data) {
    const randomIndex = Phaser.Math.Between(0, data.length - 1);
    const randomWord = data[randomIndex];
    return { word: randomWord.targetWord || "" };
  }

  clearLetters() {
    this.inputLetters.forEach((letter) => letter.destroy());
    this.inputLetters = [];
  }

  checkWordOrder() {
    if (this.inputLetters.length === 0) {
      return;
    }

    const assembledWord = this.inputLetters
      .sort((a, b) => a.x - b.x)
      .map((letter) => letter.text)
      .join("");

    console.log("Assembled Word:", assembledWord);

    if (assembledWord === this.correctWord) {
      console.log("Correct word!");
      this.showSuccessMessage();
      this.clearLetters();
    } else {
      console.log("Incorrect word!");
    }
  }

  showSuccessMessage() {
    const message = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      "Well done!",
      { fontSize: "40px", color: "#00FF00" }
    ).setOrigin(0.5).setDepth(10);

    this.tweens.add({
      targets: message,
      alpha: 0,
      duration: 2000,
      onComplete: () => message.destroy(),
    });

    if (this.bridgeBlock) {
      this.bridgeBlock.destroy();
      this.bridgeBlock = null;
    }
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
