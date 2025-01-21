import Phaser from "phaser";
import CaveCollisions from "../imports/caveCollisions";

class CaveScene extends Phaser.Scene {
  constructor() {
    super({ key: "CaveScene" });
    this.playerScore = 0;
    this.inputElement = null;
    this.isTaskActive = false;
    this.rightWordData = []; // Initialize rightWordData
    this.leftWordData = []; // Initialize leftWordData
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
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    const savedScore = localStorage.getItem("playerScore");
    this.playerScore = savedScore ? parseInt(savedScore, 10) : 0;
    this.game.sound.stopAll();

    // Chest creation (it will be visible but surrounded by low lighting)
    this.chest = this.physics.add
      .staticSprite(650, 400, "chest")
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

    // Create cave blocks (collisions)
    const caveBlocks = new CaveCollisions(this);
    const caveCollisionGroup = caveBlocks.getCaveBlocks();
    this.physics.add.collider(this.player, caveCollisionGroup);

    this.player.setCollideWorldBounds(true);

    this.lighting = this.make.graphics({ x: 0, y: 0, add: false });
    this.lighting.fillStyle(0x000000, 0.9);
    this.mask = this.lighting.createGeometryMask();
    cave.setMask(this.mask);

    this.lightRadius = 100;

    // Fetch and display the words
    this.fetchAndDisplayWords();

    // Add overlap check for chest (to trigger task when player reaches chest)
    this.physics.add.overlap(
      this.player,
      this.chest,
      this.triggerTaskOnChestInteraction,
      null,
      this
    );
  }

  triggerTaskOnChestInteraction(player, chest) {
    console.log("Chest overlap detected!");
    console.log("Right Word Data:", this.rightWordData); // Debug log to check if the data exists
    console.log("Task active?", this.isTaskActive);
    if (this.isTaskActive) return; // Ensure the task isn't already active

    if (this.rightWordData.length > 0) {
      const firstWord = this.rightWordData[0];
      const correctAnswer = this.leftWordData.find(
        (word) => word.rank === firstWord.rank
      ).text;

      this.showTextInputModal(firstWord.text, correctAnswer);
    }
  }

  showTextInputModal(targetWord, correctAnswer) {
    console.log(`Displaying modal for word: ${targetWord}`);
    console.log(`Correct answer: ${correctAnswer}`);

    // Prevent multiple modals from opening at the same time
    if (this.inputElement) return;

    // Create input and button elements dynamically
    this.inputElement = document.createElement("div");
    this.inputElement.style.position = "absolute";
    this.inputElement.style.top = "50%";
    this.inputElement.style.left = "50%";
    this.inputElement.style.transform = "translate(-50%, -50%)";
    this.inputElement.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    this.inputElement.style.padding = "20px";
    this.inputElement.style.borderRadius = "10px";
    this.inputElement.style.color = "red";
    this.inputElement.style.textAlign = "center";

    const wordDisplay = document.createElement("h3");

    // Create two span elements for different colors
    const redText = document.createElement("span");
    redText.textContent = "Find the word for: ";
    redText.style.color = "red"; // Red color for this part

    const targetWordText = document.createElement("span");
    targetWordText.textContent = targetWord; // Add the target word to the sentence
    targetWordText.style.color = "red"; // Make target word red

    // Append the span elements together
    wordDisplay.appendChild(redText);
    wordDisplay.appendChild(targetWordText);

    // Append wordDisplay to the inputElement
    this.inputElement.appendChild(wordDisplay);

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Enter the correct word";
    this.inputElement.appendChild(input);

    // Add Submit button
    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    this.inputElement.appendChild(submitButton);

    // Add Skip button
    const skipButton = document.createElement("button");
    skipButton.textContent = "Skip";
    this.inputElement.appendChild(skipButton);

    document.body.appendChild(this.inputElement);

    // Handle submit button click
    submitButton.addEventListener("click", () => {
      const userAnswer = input.value.trim().toLowerCase();
      const correctAnswerLower = correctAnswer.toLowerCase();

      if (userAnswer === correctAnswerLower) {
        this.addPoints(1); // Add points for the correct answer
        this.showInGameFeedback("Correct! You've earned 1 point.", 3000);
      } else {
        this.showInGameFeedback("Incorrect. Try again!", 3000);
      }

      // Clean up and reset task state
      this.isTaskActive = false;
      document.body.removeChild(this.inputElement);
      this.inputElement = null; // Reset the input element reference

      // Move to the next word after correct answer or skip
      this.moveToNextWord();
      console.log("User Answer:", userAnswer);
      console.log("Correct Answer:", correctAnswer);
    });

    // Handle skip button click
    skipButton.addEventListener("click", () => {
      // Skip the current task
      this.showInGameFeedback("You skipped the word.", 3000);

      // Clean up and reset task state
      this.isTaskActive = false;
      document.body.removeChild(this.inputElement);
      this.inputElement = null; // Reset the input element reference

      // Move to the next word after skip
      this.moveToNextWord();
    });

    // Set the task to active so the player cannot move while the task is active
    this.isTaskActive = true;
  }

  moveToNextWord() {
    if (this.rightWordData.length > 0) {
      // Remove the first word from the rightWordData (i.e., the current task)
      this.rightWordData.shift();

      // If there are still words left, show the next word
      if (this.rightWordData.length > 0) {
        const nextWord = this.rightWordData[0];
        const correctAnswer = this.leftWordData.find(
          (word) => word.rank === nextWord.rank
        ).text;

        // Call the modal again for the next word
        this.showTextInputModal(nextWord.text, correctAnswer);
      } else {
        // If there are no more words, display a message or finish the task
        this.delayedCall(
          this.showInGameFeedback(
            "Congratulations! You've completed all tasks.",
            10000
          ),
          3000
        );
      }
    }
  }

  showInGameFeedback(message, duration) {
    // Create an in-game feedback text element
    const feedbackText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY - 50,
      message,
      {
        fontSize: "24px",
        color: "#ffcc00",
        align: "center",
      }
    );
    feedbackText.setOrigin(0.5);

    // Fade out the feedback text after the specified duration
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
    fetch("https://eurolingo.onrender.com/api/italian", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        const randomWords = this.getRandomWords(data, 10);
        this.displayWords(randomWords);
        console.log(randomWords);
      })
      .catch((error) => console.error("API Error:", error));
  }

  displayWords(data) {
    // Populate the word data
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
    // Clean up the input element when the scene is stopped
    if (this.inputElement && document.body.contains(this.inputElement)) {
      document.body.removeChild(this.inputElement);
    }
  }

  update() {
    if (this.isTaskActive) {
      return; // Don't allow movement while the task is active
    }

    this.player.setVelocity(0);

    // Movement logic
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

    // Update lighting mask
    this.lighting.clear();
    this.lighting.fillStyle(0x000000, 0.9);
    this.lighting.fillCircle(
      this.player.x + this.player.width + 5 / 1.6,
      this.player.y + this.player.height + 5 / 1.6,
      this.lightRadius
    );

    // Distance check for chest visibility
    const distance = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.chest.x,
      this.chest.y
    );

    console.log(`Distance to chest: ${distance}`); // Debug distance

    if (distance <= 100) {
      console.log("Player is near the chest. Making it visible."); // Debug log
      this.chest.setVisible(true);
    } else {
      console.log("Player is far from the chest. Hiding it."); // Debug log
      this.chest.setVisible(false);
    }
  }
}

export default CaveScene;
