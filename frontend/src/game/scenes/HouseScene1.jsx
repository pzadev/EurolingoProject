import Phaser from "phaser";
import HouseCollisionBlocks from "../imports/houseCollisionBlocks";

class HouseScene1 extends Phaser.Scene {
  constructor() {
    super({ key: "House1" });
    this.leftWords = []; // Left words (English)
    this.rightWords = []; // Right words (Target language)
    this.matchedPairs = []; // Matched word pairs
    this.rightWordData = [];
    this.leftWOrdData = [];
    this.roundCount = 0;
    this.guideMessageDisplayed = false;
  }

  preload() {
    this.load.image("house2", "assets/house2.png");
    this.load.spritesheet("guy", "assets/guy.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("chest", "game_folder/assets/Chest_Anim.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.image("exMark", "game_folder/assets/Look_At_Me.png");
    this.load.image("collision", "assets/collision.png");
    this.load.image("rome", "assets/rome.png");
    this.load.audio("italy", "assets/italySong.mp3");
    this.doorOpenSound = this.sound.add("doorOpen", { volume: 0.2 });
    this.load.image("guide", "game_folder/assets/Guide.png");
    this.load.image("journal", "game_folder/assets/Learn_Journal.png");
    this.load.image("back", "game_folder/assets/Back_BTN.png");
    this.load.image("test", "game_folder/assets/Ukr_Congrats.png");
    this.load.image("speech", "game_folder/assets/Speech Bubble.png");
  }

  create() {
    // Stop BG Music in House

    const backgroundMusic = this.sound.get("backgroundMusic");
    if (backgroundMusic) {
      backgroundMusic.stop();
    }

    if (!this.sound.get("italy")) {
      this.backgroundMusic = this.sound.add("italy", {
        loop: true,
        volume: 0.1,
      });
      this.backgroundMusic.play();
    } else {
      const backgroundMusic = this.sound.get("italy");
      if (!backgroundMusic.isPlaying) {
        backgroundMusic.play();
      }
    }

    this.cursors = this.input.keyboard.createCursorKeys();

    // House image
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;
    const houseImage = this.add
      .image(gameWidth / 2, gameHeight / 2, "house2")
      .setOrigin(0.5, 0.5)
      .setScale(0.5);

    this.player = this.physics.add
      .sprite(350, 300, "guy")
      .setSize(18, 10)
      .setScale(3.5)
      .setOrigin(0, 0)
      .setOffset(6.5, 14);

    this.rome = this.add
      .image(575, 133, "rome")
      .setOrigin(0, 0)
      .setAlpha(0.9)
      .setScale(0.1);

    this.add.image(320, 290, "guide").setDepth(3).setScale(0.18).setAlpha(0.8);
    //guide area
    this.guideArea = this.physics.add.staticGroup();
    this.guideArea = this.physics.add.staticGroup();
    const guideCollision = this.guideArea
      .create(320, 290, "collision")
      .setSize(50, 50);
    guideCollision.setAlpha(0);

    this.physics.add.overlap(
      this.player,
      guideCollision,
      this.guideInteraction,
      null,
      this
    );

    this.player.setCollideWorldBounds(true);

    // House collision and door data for HouseScene
    const houseCollisionBlocks = new HouseCollisionBlocks(this);
    const houseCollisionGroup = houseCollisionBlocks.getHouseBlocks();
    this.physics.add.collider(this.player, houseCollisionGroup);

    // Door Area for HouseScene
    this.doorArea = this.physics.add.staticGroup();
    const houseDoor = this.doorArea
      .create(470, 160, "collision")
      .setSize(30, 70);
    houseDoor.visible = false;

    this.physics.add.collider(
      this.player,
      this.doorArea,
      function (player, doorArea) {
        console.log("You are at the door!");
        this.doorOpenSound.play();
        this.scene.start("Main", { x: 500, y: 685 });
      },
      null,
      this
    );

    // Chest and Exclamation mark setup
    this.chestOpened = false;

    this.Book_exMark = this.physics.add
      .staticSprite(320, 370, "exMark")
      .setScale(0.06)
      .refreshBody();
    this.physics.add.collider(
      this.player,
      this.Book_exMark,
      this.lookAtJournal,
      null,
      this
    );

    this.physics.add.collider(
      this.player,
      this.chest,
      this.openChest,
      null,
      this
    );

    this.physics.add.collider(
      this.player,
      this.Book_exMark,
      this.lookAtJournal,
      null,
      this
    );
    this.journalTriggered = false;
    this.anims.create({
      key: "openChest",
      frames: this.anims.generateFrameNumbers("chest", { start: 0, end: 5 }),
      frameRate: 8,
      repeat: 0,
    });

    // World bounds and camera
    this.physics.world.setBounds(0, 0, 735, 800);
    this.cameras.main.setBounds(0, 0, 800, 800);
  }

  //pop-up-message-on-guide

  guideInteraction() {
    if (this.reminder && this.speech) {
      this.reminder.destroy();
      this.speech.destroy();
    }

    if (this.journalTriggered === true) {
      console.log("box");
      this.speech = this.add.image(420, 200, "speech").setScale(0.15);
      this.reminder = this.add.text(
        310,
        154,
        "Hey!\nI think you should\nlook in the box!",
        {
          fontSize: "18px",
          color: "#ffffff",
          align: "center",
          padding: {
            x: 10,
            y: 5,
          },
        }
      );
      this.time.delayedCall(3000, () => {
        if (this.reminder && this.speech) {
          this.reminder.destroy();
          this.speech.destroy();
          this.reminder = null;
        }
      });
    }

    if (this.journalTriggered === false) {
      this.speech = this.add.image(420, 200, "speech").setScale(0.15);
      this.reminder = this.add.text(
        310,
        154,
        "Hey!\nI think you should\nlook in the book!",
        {
          fontSize: "18px",
          color: "#ffffff",
          align: "center",
          padding: {
            x: 10,
            y: 5,
          },
        }
      );

      this.time.delayedCall(3000, () => {
        if (this.reminder && this.speech) {
          this.reminder.destroy();
          this.speech.destroy();
          this.reminder = null;
        }
      });
    }
  }

  guideZone() {
    this.guideMessageDisplayed = false;
    this.showGuideMessage();
  }

  lookAtJournal() {
    if (this.journalTriggered) return;

    this.journalTriggered = true;
    this.Chest_exMark = this.physics.add
      .staticSprite(540, 223, "exMark")
      .setScale(0.06)
      .setDepth(2)
      .refreshBody();
    this.interaction = true;
    this.chestOpened = false;
    this.chest = this.physics.add
      .staticSprite(540, 223, "chest")
      .setScale(4)
      .refreshBody();
    this.physics.add.collider(
      this.player,
      this.chest,
      this.openChest,
      null,
      this
    );
    this.interaction = true;
    this.chestOpened = false;
    this.fetchAndDisplayWords();
    this.Book_exMark.destroy();
  }

  fetchAndDisplayWords() {
    this.journalImage = this.add.image(500, 310, "journal").setDepth(3);
    this.journalImage.displayWidth = 1200;
    this.journalImage.displayHeight = 1050;
    fetch("https://eurolingo.onrender.com/api/italian", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        const randomWords = this.getRandomWords(data, 5);
        this.displayWords(randomWords);
      })
      .catch((error) => console.error("API Error:", error));
  }

  displayWords(data) {
    console.log(this.leftWords);
    console.log(this.rightWords);
    const leftWordsData = data.map((item) => ({
      text: item.englishWord,
      rank: item.rank,
    }));
    const rightWordsData = data.map((item) => ({
      text: item.targetWord,
      rank: item.rank,
    }));

    this.leftWordData = leftWordsData;
    this.rightWordData = rightWordsData;

    leftWordsData.forEach((leftItem, index) => {
      this.createLeftText(
        leftItem.text,
        170,
        60 + index * 70,
        leftItem.rank,
        "#8B0000",
        this.leftWords
      );
      this.createRightText(
        rightWordsData[index].text,
        590,
        60 + index * 70,
        rightWordsData[index].rank,
        "#000000",
        this.rightWords
      );
    });

    this.createBackButton();
  }

  createLeftText(text, x, y, rank, color) {
    const word = this.add
      .text(x, y, text, { fontSize: "50px", color })
      .setDepth(3);
    word.rank = rank;
    this.leftWords.push(word);
  }
  createRightText(text, x, y, rank, color) {
    const word = this.add
      .text(x, y, text, { fontSize: "50px", color })
      .setDepth(3);
    word.rank = rank;
    this.rightWords.push(word);
  }

  createBackButton() {
    this.back_btn = this.add
      .image(860, 565, "back")
      .setDepth(3)
      .setInteractive();
    this.back_btn.on("pointerdown", () => this.cleanJournal());
  }

  cleanJournal() {
    [
      this.back_btn,
      this.journalImage,
      ...this.leftWords,
      ...this.rightWords,
    ].forEach((item) => item?.destroy());

    this.interaction = false;
    // this.journalTriggered = false;

    if (!this.Chest_exMark) {
      this.Chest_exMark = this.physics.add
        .staticSprite(540, 223, "exMark")
        .setScale(0.06)
        .setDepth(2)
        .refreshBody();
    }
  }

  openChest(player, chest) {
    if (!this.chestOpened) {
      this.interaction = true;
      this.chestOpened = true; // Set the flag to true
      chest.anims.play("openChest", true);
      console.log("Chest opened!");
      this.triggerWordMatching(); // Start word matching after chest is opened
    }
  }

  triggerWordMatching() {
    console.log(this.leftWords);
    if (this.interaction === true) {
      this.matchedPairs = [];
      console.log("Left Word Data:", this.leftWordData);
      console.log("Right Word Data:", this.rightWordData);
      Phaser.Utils.Array.Shuffle(this.leftWordData);
      Phaser.Utils.Array.Shuffle(this.rightWordData);
      this.leftWordData.forEach((leftWordData, index) => {
        const leftItem = leftWordData.text;
        const rightWordData = this.rightWordData[index];
        const rightItem = rightWordData.text;

        console.log("Left Word:", leftItem);
        console.log("Right Word:", rightItem);

        const startX = this.chest.x;
        const startY = this.chest.y - 20;

        // Left Side (English words)
        const leftText = this.add
          .text(startX, startY, leftItem, {
            fontSize: "20px",
            color: "#FFFFFF",
          })
          .setDepth(5)
          .setAlpha(0)
          .setInteractive();
        this.input.setDraggable(leftText);

        // Assign rank and wordName properties correctly
        leftText.wordName = leftWordData.englishWord;
        leftText.rank = leftWordData.rank;

        this.leftWords.push(leftText);

        // Right Side (Shuffled Target language words)
        const rightText = this.add
          .text(startX, startY, rightItem, {
            fontSize: "20px",
            color: "#FFFFFF",
          })
          .setDepth(5)
          .setAlpha(0)
          .setInteractive();
        this.input.setDraggable(rightText);

        // Assign rank and wordName properties correctly
        rightText.wordName = rightWordData.targetWord; // Set the target word
        rightText.rank = rightWordData.rank; // Set the same rank as the left item for matching

        this.rightWords.push(rightText);

        const leftTargetX = 50;
        const rightTargetX = 850;
        const targetY = 50 + index * 70;

        // Animate left words
        this.tweens.add({
          targets: leftText,
          x: leftTargetX,
          y: targetY,
          alpha: 1,
          duration: 1000,
          ease: "Power2",
        });

        // Animate right words
        this.tweens.add({
          targets: rightText,
          x: rightTargetX,
          y: targetY,
          alpha: 1,
          duration: 1000,
          ease: "Power2",
        });
      });

      // Add drag events for interaction
      this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
        gameObject.x = dragX;
        gameObject.y = dragY;
        // Check for matches as player drags words
        this.checkForMatches();
      });

      this.Chest_exMark.destroy();
    }
  }

  checkForMatches() {
    this.leftWords.forEach((leftWord) => {
      this.rightWords.forEach((rightWord) => {
        console.log("Left Text:", leftWord.x, leftWord.y);
        console.log("Right Text:", rightWord.x, rightWord.y); // Log position of right word

        // Get their bounds for overlap detection
        const leftBounds = leftWord.getBounds();
        const rightBounds = rightWord.getBounds();

        // Log bounds to help debug if they overlap correctly

        // Check for overlap
        const overlap = Phaser.Geom.Intersects.RectangleToRectangle(
          leftBounds,
          rightBounds
        );
        console.log(leftWord.rank);

        if (overlap) {
          console.log("Overlap Detected!");

          // Check if ranks match
          if (leftWord.rank === rightWord.rank) {
            const pairKey = `${leftWord.text}-${rightWord.text}`;

            // Ensure the pair isn't already matched
            if (!this.matchedPairs.includes(pairKey)) {
              console.log("Matched Pair:", pairKey);
              this.matchedPairs.push(pairKey);

              // Destroy matched words
              leftWord.destroy();
              rightWord.destroy();

              // Remove matched objects from arrays
              Phaser.Utils.Array.Remove(this.leftWords, leftWord);
              Phaser.Utils.Array.Remove(this.rightWords, rightWord);

              this.showWellDoneMessage();
            }
          }
        }
      });
    });

    // Check if all pairs have been matched
    if (this.matchedPairs.length === this.leftWords.length) {
      this.roundComplete();
    }
  }

  getRandomWords(array, count) {
    // Shuffle the array
    const shuffled = Phaser.Utils.Array.Shuffle(array);
    // Return the first count elements
    return shuffled.slice(0, count);
  }

  showWellDoneMessage() {
    const message = this.add
      .text(this.scale.width / 2, this.scale.height / 2, "Well done!", {
        fontSize: "40px",
        color: "#00ff00",
      })
      .setOrigin(0.5)
      .setDepth(10);

    // Fade out the message after 2 seconds
    this.tweens.add({
      targets: message,
      alpha: 0,
      duration: 2500,
      onComplete: () => {
        message.destroy();
      },
    });
  }

  roundComplete() {
    const username = this.game.registry.get("username");
    console.log(username);
    if (this.isComplete) {
      return; // Prevent triggering multiple times
    }
    this.roundCount++;
    this.isComplete = true; // Mark as complete
    console.log("Round Complete!");

    // Display the round completion image
    this.add.image(420, 200, "test").setScale(0.2);

    if (this.roundCount === 5) {
      fetch(`https://eurolingo.onrender.com/api/users/${username}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: "italian",
        }),
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log(response);
        return response.json();
      });
    }

    // Reset round state for next round
    this.matchedPairs = [];
    this.leftWords = [];
    this.rightWords = [];

    this.isComplete = false;
    console.log(this.roundCount);
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

export default HouseScene1;
