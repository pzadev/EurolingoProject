import Phaser from "phaser";
import CaveCollisions from "../imports/caveCollisions";

class CaveScene extends Phaser.Scene {
  constructor() {
    super({ key: "CaveScene" });
    this.playerScore = 0;
    this.inputElement = null;
    this.isTaskActive = false;
    this.rightWordData = [];
    this.leftWordData = [];
    this.skippedAndFindWordsCount = 0;
    this.onlySkippCount = 0;
    this.gameFinished = false;
  }

  init(data) {
    this.selectedLanguage = data.selectedLanguage || "french";
    console.log("Cave scene language: " + this.selectedLanguage);
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
    this.load.spritesheet("chest", "assets/Chest_Anim.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.image("collision", "assets/collision.png");
    this.load.image("guide", "assets/Guide.png");
    this.load.image("speech", "assets/Speech Bubble.png");
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    const savedScore = localStorage.getItem("playerScore");
    this.playerScore = savedScore ? parseInt(savedScore, 10) : 0;
    this.game.sound.stopAll();

    const possibleChestPositions = [
      { x: 300, y: 400 },
      { x: 600, y: 500 },
      { x: 730, y: 250 },
      { x: 500, y: 460 },
      { x: 670, y: 550 },
    ];

    const randomPosition = Phaser.Utils.Array.GetRandom(possibleChestPositions);

    this.chest = this.physics.add
      .staticSprite(randomPosition.x, randomPosition.y, "chest")
      .setScale(2)
      .setDepth(10)
      .setVisible(true)
      .refreshBody();

    this.scoreText = this.add.text(10, 10, `Score: ${this.playerScore}`, {
      fontSize: "20px",
      color: "#ffffff",
    });

    const cave = this.add
      .image(0, 0, "cave")
      .setOrigin(0, 0)
      .setScale(1.587, 1.2);

    this.player = this.physics.add
      .sprite(535, 170, "guy")
      .setSize(18, 10)
      .setScale(2.2)
      .setOrigin(0, 0)
      .setOffset(6.5, 14);

    //create npc-probably reset
    this.guide = this.physics.add
      .staticSprite(480, 230, "guide")
      .setScale(0.15)
      .setDepth(3)
      .setAlpha(0.8)
      .setVisible(true)
      .refreshBody();
    this.guideArea = this.physics.add.staticGroup();
    const guideCollision = this.guideArea
      .create(480, 230, "collision")
      .setSize(50, 50);
    guideCollision.setAlpha(0);

    this.physics.add.collider(
      this.player,
      guideCollision,
      this.guideInteraction,
      null,
      this
    );

    this.teleport = this.physics.add.staticGroup();
    const teleport = this.teleport
      .create(555, 170, "collision")
      .setSize(20, 20)
      .setOrigin(1, 1);
    teleport.visible = false;
    teleport.setData("targetScene", "BridgeScene");
    teleport.setData("startX", 850);
    teleport.setData("startY", 200);

    this.physics.add.overlap(
      this.player,
      this.teleport,
      (player, teleport) => {
        const targetScene = teleport.getData("targetScene");
        const startX = teleport.getData("startX");
        const startY = teleport.getData("startY");

        if (targetScene) {
          this.scene.start(targetScene, { x: startX, y: startY });
          this.gameFinished = false;
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

    this.lightRadius = 80;

    this.fetchAndDisplayWords();

    this.physics.add.overlap(
      this.player,
      this.chest,
      this.triggerTaskOnChestInteraction,
      null,
      this
    );
  }
  //guide interaction
  guideInteraction() {
    console.log(this.gameFinished);
    const username = this.game.registry.get("username");
    if (this.reminder && this.speech) {
      this.reminder.destroy();
      this.speech.destroy();
    }
    console.log(this.gameFinished);

    if (this.gameFinished) {
      this.speech = this.add
        .image(580, 150, "speech")
        .setScale(0.15)
        .setDepth(9);

      this.reminder = this.add
        .text(
          480,
          100,
          `Hey!\nDo you want\nRestart a game\nor see you later!`,
          {
            fontSize: "15px",
            color: "#ffffff",
            align: "center",
            padding: {
              x: 10,
              y: 5,
            },
          }
        )
        .setDepth(10);

      this.dialogContainer = this.add.container(0, 0).setDepth(10);

      this.yesButton = this.add
        .text(500, 200, "Restart", {
          fontSize: "20px",
          color: "#00ff00",
          backgroundColor: "#000",
          padding: { x: 10, y: 5 },
        })
        .setInteractive()
        .on("pointerdown", () => {
          this.skippedWordsCount = 0;
          this.onlySkippCount = 0;
          this.scene.restart();
        });

      this.dialogContainer.add(this.yesButton);
      return;
    }

    this.speech = this.add.image(580, 150, "speech").setScale(0.15).setDepth(9);
    this.reminder = this.add
      .text(480, 100, `Hey!\nYou need \nto find a chest!`, {
        fontSize: "18px",
        color: "#ffffff",
        align: "center",
        padding: {
          x: 10,
          y: 5,
        },
      })
      .setDepth(10);

    this.time.delayedCall(3000, () => {
      if (this.reminder && this.speech) {
        this.reminder.destroy();
        this.speech.destroy();
        this.reminder = null;
      }
    });
  }

  triggerTaskOnChestInteraction(player, chest) {
    if (this.isTaskActive) return;
    if (this.rightWordData.length > 0) {
      const firstWord = this.rightWordData[0];
      const correctAnswer = this.leftWordData.find(
        (word) => word.rank === firstWord.rank
      ).text;

      this.showTextInputModal(firstWord.text, correctAnswer);
    }
  }

  showTextInputModal(targetWord, correctAnswer) {
    if (this.modalContainer) return;

    this.modalContainer = this.add
      .container(this.scale.width / 2, this.scale.height / 2)
      .setDepth(100);

    const background = this.add
      .rectangle(0, 0, 400, 250, 0x000000, 0.8)
      .setOrigin(0.5);
    this.modalContainer.add(background);

    const wordText = this.add
      .text(0, -70, `Find the word for:`, {
        fontSize: "20px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);
    const targetWordText = this.add
      .text(0, -40, targetWord, {
        fontSize: "22px",
        color: "#ff0000",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    this.modalContainer.add([wordText, targetWordText]);

    // Create the HTML input element dynamically
    const input = this.add.dom(0, 10).createFromHTML(`
      <input type="text" placeholder="Enter the translation" style="
          width: 200px;
          height: 25px;
          font-size: 16px;
          text-align: center;
          color: #000000;
          border: 1px solid #000;
          border-radius: 5px;
      ">
  `);
    this.modalContainer.add(input);

    const submitButton = this.add
      .text(-110, 80, "Submit", {
        fontSize: "18px",
        color: "#00ff00",
        backgroundColor: "#000",
        padding: { x: 10, y: 5 },
      })
      .setInteractive()
      .on("pointerdown", () => {
        this.skippedAndFindWordsCount++;
        // Access the input value directly from the DOM element
        const userAnswer = input
          .getChildByID(input.node.id)
          .value.trim()
          .toLowerCase();
        const correctAnswerLower = correctAnswer.toLowerCase();

        if (this.skippedAndFindWordsCount <= 10) {
          if (userAnswer === correctAnswerLower) {
            this.addPoints(1);
            this.showInGameFeedback("Correct! You've earned 1 point.", 3000);
          } else {
            this.showInGameFeedback("Incorrect. Try again!", 3000);
          }

          this.cleanupModal(input);
          this.moveToNextWord();
        } else {
          this.skippedWordsCount = 0;
          this.cleanupModal(input);
          this.gameFinished = true;
          this.chest.destroy();
        }
      });
    this.modalContainer.add(submitButton);

    const skipButton = this.add
      .text(60, 80, "Skip", {
        fontSize: "18px",
        color: "#ff0000",
        backgroundColor: "#000",
        padding: { x: 10, y: 5 },
      })
      .setInteractive()
      .on("pointerdown", () => {
        this.skippedAndFindWordsCount++;
        this.onlySkippCount++;
        // Show feedback for skipped word
        if (this.skippedAndFindWordsCount < 9) {
          this.showInGameFeedback(
            `You skipped ${this.onlySkippCount} word(s).`,
            3000
          );
        }

        if (this.skippedAndFindWordsCount === 9) {
          this.showInGameFeedback("You have one more word.", 3000);
        }
        this.cleanupModal(input);

        if (
          this.skippedAndFindWordsCount > 9 &&
          this.rightWordData.length <= 1
        ) {
          this.skippedAndFindWordsCount = 0;
          this.onlySkippCount = 0;
          this.gameFinished = true;
          this.chest.destroy();
          this.showInGameFeedback(
            "Congratulations! You've completed all tasks.",
            5000
          );
          return;
        } else {
          this.moveToNextWord();
        }
      });
    this.modalContainer.add(skipButton);
  }

  cleanupModal(input) {
    if (this.modalContainer) {
      this.modalContainer.destroy();
      this.modalContainer = null;
    }
  }

  moveToNextWord() {
    if (this.rightWordData.length > 0) {
      this.rightWordData.shift();
      if (this.rightWordData.length === 0) {
        this.gameFinished = true;

        this.showInGameFeedback(
          "Congratulations! You've completed all tasks.",
          5000
        );
      } else {
        const nextWord = this.rightWordData[0];
        const correctAnswer = this.leftWordData.find(
          (word) => word.rank === nextWord.rank
        ).text;
        this.showTextInputModal(nextWord.text, correctAnswer);
      }
    }
  }

  showInGameFeedback(message, duration) {
    const feedbackText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY - 160,
      message,
      {
        fontSize: "24px",
        color: "#ffcc00",
        align: "center",
      }
    );
    feedbackText.setOrigin(0.5);

    this.tweens.add({
      targets: feedbackText,
      alpha: 0,
      duration: 1000,
      onComplete: () => {
        feedbackText.destroy();
      },
    });
  }

  fetchAndDisplayWords() {
    fetch(`https://eurolingo.onrender.com/api/${this.selectedLanguage}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        const randomWords = this.getRandomWords(data, 10);
        this.displayWords(randomWords);
      })
      .catch((error) => console.error("API Error:", error));
  }

  displayWords(data) {
    this.leftWordData = data.map((item) => ({
      text: item.englishWord,
      rank: item.rank,
    }));
    this.rightWordData = data.map((item) => ({
      text: item.targetWord,
      rank: item.rank,
    }));
  }

  getRandomWords(array, count) {
    const shuffled = Phaser.Utils.Array.Shuffle(array);
    return shuffled.slice(0, count);
  }

  addPoints(points) {
    this.playerScore += points;
    localStorage.setItem("playerScore", this.playerScore);
    if (this.scoreText) {
      this.scoreText.destroy();
    }
    this.scoreText = this.add
      .text(10, 10, `Score: ${this.playerScore}`, {
        fontSize: "20px",
        color: "#ffffff",
      })
      .setScrollFactor(0);
  }

  shutdown() {
    if (this.inputElement && document.body.contains(this.inputElement)) {
      document.body.removeChild(this.inputElement);
    }
  }

  update() {
    if (this.isTaskActive) {
      return;
    }

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

    const distanceToTheChest = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.chest.x,
      this.chest.y
    );
    const distanceToNPC = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.guide.x,
      this.guide.y
    );

    if (distanceToTheChest <= 80) {
      this.chest.setVisible(true);
    } else {
      this.chest.setVisible(false);
    }
    if (distanceToNPC <= 80) {
      // console.log("Player is near the chest. Making it visible."); // Debug log
      this.guide.setVisible(true);
    } else {
      // console.log("Player is far from the chest. Hiding it."); // Debug log
      this.guide.setVisible(false);
    }
  }
}

export default CaveScene;
