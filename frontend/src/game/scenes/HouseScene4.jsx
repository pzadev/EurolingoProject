import Phaser from "phaser";
import HouseCollisionBlocks from "../imports/houseCollisionBlocks";

class HouseScene4 extends Phaser.Scene {
    constructor() {
        super({ key: "House4" });
        this.leftWords = []; // Left words (English)
        this.rightWords = []; // Right words (Target language)
        this.matchedPairs = []; // Matched word pairs
        this.isComplete = false
        this.interaction = false
        this.attainFlag = 0
    }

    preload() {
        this.load.image("house2", "assets/house2.png");
        this.load.spritesheet("guy", "assets/guy.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet('chest', 'game_folder/assets/Chest_Anim.png', {
            frameWidth: 16,
            frameHeight: 16,
        });
        this.load.image('test', 'game_folder/assets/French_Round.png')
        this.load.image("exMark","game_folder/assets/Look_At_Me.png")
        this.load.image("collision", "assets/collision.png");
        this.doorOpenSound = this.sound.add("doorOpen", { volume: 0.2 });
        this.load.image("EifelT", "game_folder/assets/Eifel_Tower.png")
        this.load.audio("ukrSong", "assets/ukrSong.mp3");
        this.load.image("guide", 'game_folder/assets/Guide.png')
        this.load.image('journal', 'game_folder/assets/Learn_Journal.png')
    }

    create() {
        // Stop BG Music in House

        this.add.image(320,290, 'guide')
        .setDepth(2)
        .setScale(.18)
        .setAlpha(0.8)
        const backgroundMusic = this.sound.get("backgroundMusic");
        if (backgroundMusic) {
            backgroundMusic.stop();
        }

        if (!this.sound.get("ukrSong")) {
            this.backgroundMusic = this.sound.add("ukrSong", {
              loop: true,
              volume: 0,
            });
            this.backgroundMusic.play();
          } else {
            const backgroundMusic = this.sound.get("ukrSong");
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

        this.player.setCollideWorldBounds(true);

        // House collision and door data for HouseScene
        const houseCollisionBlocks = new HouseCollisionBlocks(this);
        const houseCollisionGroup = houseCollisionBlocks.getHouseBlocks();
        this.physics.add.collider(this.player, houseCollisionGroup);

        // Door Area for HouseScene
        this.doorArea = this.physics.add.staticGroup();
        const houseDoor = this.doorArea
            .create(465, 170, "collision")
            .setSize(10, 70);
        houseDoor.visible = false;

        this.physics.add.collider(
            this.player,
            this.doorArea,
            function (player, doorArea) {
                console.log("You are at the door!");
                this.doorOpenSound.play();
                this.scene.start("Main", { x: 1185, y: 1135 });
            },
            null,
            this
        );

        // Chest and exclamation mark
        // this.chestOpened = false;
        // this.chest = this.physics.add.staticSprite(540, 223, 'chest')
        //     .setScale(4)
        //     .refreshBody();
        this.exMark = this.physics.add.staticSprite(320, 235, 'exMark')
            .setScale(0.06)
            .refreshBody();
        this.Book_exMark = this.physics.add.staticSprite(308, 360, 'exMark')
            .setScale(0.06)
            .refreshBody();

        this.physics.add.collider(this.player, this.chest, this.openChest, null, this);

        this.physics.add.collider(this.player, this.Book_exMark, this.lookAtJournal, null, this)
        this.journalTriggered = false
        this.anims.create({
            key: 'openChest',
            frames: this.anims.generateFrameNumbers('chest', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: 0,
        });

        // World bounds and camera
        this.physics.world.setBounds(0, 0, 750, 800);
        this.cameras.main.setBounds(0, 0, 800, 800);
    }

    lookAtJournal() {
        if (!this.journalTriggered) {
            this.journalTriggered = true; 
            this.inspsectApi();
            this.Book_exMark.destroy()
            this.Chest_exMark = this.physics.add.staticSprite(540, 223, 'exMark')
            .setScale(0.06)
            .setDepth(2)
            .refreshBody();
            this.interaction = true
            this.chestOpened = false;
            this.chest = this.physics.add.staticSprite(540, 223, 'chest')
            .setScale(4)
            .refreshBody();
            this.physics.add.collider(this.player, this.chest, this.openChest, null, this);
        }
    }

    openChest(player, chest) {
        if (!this.chestOpened) {
            this.chestOpened = true; // Set the flag to true
            chest.anims.play('openChest', true);
            console.log('Chest opened!');
            this.triggerWordMatching(); // Trigger the word matching when chest is opened
        }
    }

    inspsectApi(){
        console.log("Triggering learning!");
        fetch("https://eurolingo.onrender.com/api/ukrainian", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("API Response:", data);
          })
    }

    triggerWordMatching() {

        if(this.interaction === true){
        console.log("Triggering word matching!");
        fetch("https://eurolingo.onrender.com/api/ukrainian", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("API Response:", data);
            // Generate 5 random word pairs
            const randomWords = this.getRandomWords(data, 5);
            // Split the words into left and right arrays
            const leftWordsData = randomWords.map((item) => ({
              text: item.englishWord,
              rank: item.rank,
            }));
            const rightWordsData = randomWords.map((item) => ({
              text: item.targetWord,
              rank: item.rank,
            }));
            // Shuffle the right words to mix them up
            Phaser.Utils.Array.Shuffle(rightWordsData);
            leftWordsData.forEach((leftItem, index) => {
              // Calculate starting position near the chest
              const startX = this.chest.x;
              const startY = this.chest.y - 20;
              // Left Side (English words)
              const leftText = this.add
                .text(startX, startY, leftItem.text, {
                  fontSize: "20px",
                  color: "#FFFFFF",
                })
                .setDepth(5)
                .setAlpha(0) // Start fully transparent
                .setInteractive(); // Enable interaction for the text
              this.input.setDraggable(leftText);
              leftText.wordName = leftItem.text; // Store the word's name
              leftText.rank = leftItem.rank; // Store the rank for matching
              this.leftWords.push(leftText); // Add to leftWords array
              // Right Side (Shuffled Target language words)
              const rightItem = rightWordsData[index];
              const rightText = this.add
                .text(startX, startY, rightItem.text, {
                  fontSize: "20px",
                  color: "#FFFFFF",
                })
                .setDepth(5)
                .setAlpha(0) // Start fully transparent
                .setInteractive(); // Enable interaction for the text
              this.input.setDraggable(rightText);
              rightText.wordName = rightItem.text; // Store the word's name
              rightText.rank = rightItem.rank; // Store the rank for matching
              this.rightWords.push(rightText); // Add to rightWords array
              // Animate the words to their respective sides
              const leftTargetX = 50; // Target X position for left words
              const rightTargetX = 850; // Target X position for right words
              const targetY = 50 + index * 70; // Calculate target Y position based on index
              // Animate left words
              this.tweens.add({
                targets: leftText,
                x: leftTargetX,
                y: targetY,
                alpha: 1, // Fade in
                duration: 1000,
                ease: "Power2",
              });
              // Animate right words
              this.tweens.add({
                targets: rightText,
                x: rightTargetX,
                y: targetY,
                alpha: 1, // Fade in
                duration: 1000,
                ease: "Power2",
              });
            });
            // Add drag events
            this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
              gameObject.x = dragX;
              gameObject.y = dragY;
              // Check for matches
              this.checkForMatches();
            });
          })
          .catch((error) => {
            console.error("API Error:", error);
          });
          this.Chest_exMark.destroy()
        }
      }

    getRandomWords(array, count) {
        // Shuffle the array
        const shuffled = Phaser.Utils.Array.Shuffle(array);
        // Return the first count elements
        return shuffled.slice(0, count);
    }

    checkForMatches() {
        this.leftWords.forEach((leftWord) => {
            this.rightWords.forEach((rightWord) => {
                const overlap = Phaser.Geom.Intersects.RectangleToRectangle(
                    leftWord.getBounds(),
                    rightWord.getBounds()
                );
    
                // Match based on overlapping and the same rank
                if (overlap && leftWord.rank === rightWord.rank) {
                    const pairKey = `${leftWord.wordName}-${rightWord.wordName}`;
    
                    // Check if the pair has already been matched
                    if (!this.matchedPairs.includes(pairKey)) {
                        this.matchedPairs.push(pairKey); // Mark as matched
    
                        // Optionally, destroy the words
                        leftWord.destroy();
                        rightWord.destroy();
    
                        // Remove from arrays to prevent further checks
                        Phaser.Utils.Array.Remove(this.leftWords, leftWord);
                        Phaser.Utils.Array.Remove(this.rightWords, rightWord);
    
                        // Display "Well done" message
                        this.showWellDoneMessage();
                    }
                }
            });
        });
    
        // Check if all pairs for the current round are matched
        if (this.matchedPairs.length === 5) { // Ensure this matches the round pair count
            this.roundComplete();
        }
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

    // round complete function, triggered after this.matchedPairs.length === 5 i.e all words matched
    // new image 
    roundComplete() {
        if (this.isComplete) {
            return; // Prevent triggering multiple times
        }
    
        this.isComplete = true; // Mark as complete
        console.log("Round Complete!");
    
        // Display the round completion image
        this.add
            .image(420, 200, "test")
            .setScale(0.2);
    
        // Reset round state for next round
        this.matchedPairs = [];
        this.leftWords = [];
        this.rightWords = [];
        this.attainFlag ++
        this.isComplete = false
        console.log(this.attainFlag)
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

export default HouseScene4;
