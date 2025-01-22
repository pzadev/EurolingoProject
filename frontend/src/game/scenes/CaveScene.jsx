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
    this.skippedWordsCount = 0;
    this.gameFinished = false;
  }

  init(data) {
    this.language = data.language; // The language passed from BridgeScene
    console.log("Cave scene language: " + this.language);
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
    this.load.spritesheet("chest", "game_folder/assets/Chest_Anim.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.image("collision", "assets/collision.png");
    this.load.image("guide", "game_folder/assets/Guide.png");
    this.load.image("speech", "game_folder/assets/Speech Bubble.png");
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    const savedScore = localStorage.getItem("playerScore");
    this.playerScore = savedScore ? parseInt(savedScore, 10) : 0;
    this.game.sound.stopAll();

    const possibleChestPositions = [
      // { x: 840, y: 560 },
      // { x: 280, y: 200 },
      // { x: 730, y: 250 },
      // { x: 500, y: 460 },
      // { x: 670, y: 550 },
    ];

    const randomPosition = Phaser.Utils.Array.GetRandom(possibleChestPositions);

    this.chest = this.physics.add
      .staticSprite(300, 400, "chest")
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
      .staticSprite(300, 230, "guide")
      .setScale(0.15)
      .setDepth(3)
      .setAlpha(0.8)
      .setVisible(true)
      .refreshBody();
    this.guideArea = this.physics.add.staticGroup();
    const guideCollision = this.guideArea
      .create(300, 230, "collision")
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
  //guide interaction
  guideInteraction() {
    const username = this.game.registry.get("username");
    if (this.reminder && this.speech) {
      this.reminder.destroy();
      this.speech.destroy();
    }
    console.log(this.gameFinished);

    if (this.gameFinished) {
      this.speech = this.add
        .image(380, 150, "speech")
        .setScale(0.15)
        .setDepth(9);

      this.reminder = this.add
        .text(280, 100, `Hey!\nDo you want\nrestart the game?`, {
          fontSize: "18px",
          color: "#ffffff",
          align: "center",
          padding: {
            x: 10,
            y: 5,
          },
        })
        .setDepth(10);

      this.yesButton = this.add
        .text(300, 200, "Yes", {
          fontSize: "20px",
          color: "#00ff00",
          backgroundColor: "#000",
          padding: { x: 10, y: 5 },
        })
        .setInteractive()
        .on("pointerdown", () => {
          this.skippedWordsCount = 0;
          this.scene.restart();
        })
        .setDepth(10);

      this.noButton = this.add
        .text(400, 200, "No", {
          fontSize: "20px",
          color: "#ff0000",
          backgroundColor: "#000",
          padding: { x: 10, y: 5 },
        })
        .setInteractive()
        .on("pointerdown", () => {
          if (this.reminder) this.reminder.destroy();
          if (this.speech) this.speech.destroy();
          if (this.yesButton) this.yesButton.destroy();
          if (this.noButton) this.noButton.destroy();

          this.reminder = null;
          this.speech = null;
          this.yesButton = null;
          this.noButton = null;
        })
        .setDepth(10);

      return;
    }

    this.speech = this.add.image(380, 150, "speech").setScale(0.15).setDepth(9);
    this.reminder = this.add
      .text(280, 100, `Hey!\nYou need \nto find a chest!`, {
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

  // showTextInputModal(targetWord, correctAnswer) {
  //   if (this.inputElement) return;

  //   this.inputElement = document.createElement("div");
  //   this.inputElement.style.position = "absolute";
  //   this.inputElement.style.top = "50%";
  //   this.inputElement.style.left = "50%";
  //   this.inputElement.style.transform = "translate(-50%, -50%)";
  //   this.inputElement.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  //   this.inputElement.style.padding = "20px";
  //   this.inputElement.style.borderRadius = "10px";
  //   this.inputElement.style.color = "red";
  //   this.inputElement.style.textAlign = "center";

  //   const wordDisplay = document.createElement("h3");

  //   const redText = document.createElement("span");
  //   redText.textContent = "Translate this word into English: ";
  //   redText.style.color = "white";

  //   const targetWordText = document.createElement("span");
  //   targetWordText.textContent = targetWord;
  //   targetWordText.style.color = "white";

  //   wordDisplay.appendChild(redText);
  //   wordDisplay.appendChild(targetWordText);

  //   this.inputElement.appendChild(wordDisplay);

  //   const input = document.createElement("input");
  //   input.type = "text";
  //   input.placeholder = "Enter the correct word";
  //   this.inputElement.appendChild(input);

  //   const submitButton = document.createElement("button");
  //   submitButton.textContent = "Submit";
  //   this.inputElement.appendChild(submitButton);

  //   const skipButton = document.createElement("button");
  //   skipButton.textContent = "Skip";
  //   this.inputElement.appendChild(skipButton);

  //   document.body.appendChild(this.inputElement);

  //   submitButton.addEventListener("click", () => {
  //     const userAnswer = input.value.trim().toLowerCase();
  //     const correctAnswerLower = correctAnswer.toLowerCase();

  //     if (userAnswer === correctAnswerLower) {
  //       this.addPoints(1);
  //       this.showInGameFeedback("Correct! You've earned 1 point.", 3000);
  //     } else {
  //       this.showInGameFeedback("Incorrect. Try again!", 3000);
  //     }

  //     this.isTaskActive = false;
  //     document.body.removeChild(this.inputElement);
  //     this.inputElement = null;

  //     this.moveToNextWord();
  //     console.log("User Answer:", userAnswer);
  //     console.log("Correct Answer:", correctAnswer);
  //   });

  //   skipButton.addEventListener("click", () => {
  //     this.skippedWordsCount++;
  //     if (this.skippedWordsCount < 9) {
  //       this.showInGameFeedback("You skipped the word.", 3000);
  //     }
  //     if (this.skippedWordsCount === 9) {
  //       this.showInGameFeedback("You have one more word.", 3000);
  //     }

  //     document.body.removeChild(this.inputElement);
  //     this.inputElement = null;
  //     this.isTaskActive = false;
  //     if (this.skippedWordsCount > 9 && this.rightWordData.length <= 1) {
  //       this.skippedWordsCount = 0;
  //       this.chest.destroy();
  //       this.showInGameFeedback(
  //         "Congratulations! You've completed all tasks.",
  //         5000
  //       );
  //       return;
  //     } else {
  //       this.moveToNextWord();
  //     }
  //   });
  // }

  showTextInputModal(targetWord, correctAnswer) {
    console.log(`Displaying modal for word: ${targetWord}`);
    console.log(`Correct answer: ${correctAnswer}`);

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
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Enter the transtation";
    input.style.position = "absolute";
    input.style.top = `600px`;
    input.style.left = `620px`;
    input.style.width = "200px";
    input.style.height = "30px";
    input.style.fontSize = "16px";
    input.style.textAlign = "center";
    input.style.color = "#000000";
    input.style.border = "1px solid #000";
    input.style.borderRadius = "5px";
    document.body.appendChild(input);

    const submitButton = this.add
      .text(-110, 80, "Submit", {
        fontSize: "18px",
        color: "#00ff00",
        backgroundColor: "#000",
        padding: { x: 10, y: 5 },
      })
      .setInteractive()
      .on("pointerdown", () => {
        const userAnswer = input.value.trim().toLowerCase();
        const correctAnswerLower = correctAnswer.toLowerCase();

        if (userAnswer === correctAnswerLower) {
          this.addPoints(1);
          this.showInGameFeedback("Correct! You've earned 1 point.", 3000);
        } else {
          this.showInGameFeedback("Incorrect. Try again!", 3000);
        }

        this.cleanupModal(input);
        this.moveToNextWord();
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
        this.skippedWordsCount++;
        if (this.skippedWordsCount < 9) {
          this.showInGameFeedback("You skipped the word.", 3000);
        }
        if (this.skippedWordsCount === 9) {
          this.showInGameFeedback("You have one more word.", 3000);
        }

        this.cleanupModal(input);

        if (this.skippedWordsCount > 9 && this.rightWordData.length <= 1) {
          this.skippedWordsCount = 0;
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

    if (input) {
      document.body.removeChild(input);
    }
  }

  moveToNextWord() {
    if (this.rightWordData.length > 0) {
      this.rightWordData.shift();
      if (this.rightWordData.length === 0) {
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
    fetch(`https://eurolingo.onrender.com/api/${this.language}`, {
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

    const distance = Phaser.Math.Distance.Between(
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

    // console.log(`Distance to chest: ${distance}`); // Debug distance

    if (distance <= 80) {
      this.chest.setVisible(true);
    } else {
      this.chest.setVisible(false);
    }
    if (distanceToNPC <= 100) {
      // console.log("Player is near the chest. Making it visible."); // Debug log
      this.guide.setVisible(true);
    } else {
      // console.log("Player is far from the chest. Hiding it."); // Debug log
      this.guide.setVisible(false);
    }
  }
}

export default CaveScene;
