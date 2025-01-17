import Phaser from "phaser";
import HouseCollisionBlocks from "../imports/houseCollisionBlocks";
import { frenchWords } from "../../../game_folder/assets/test.data";

class HouseScene5 extends Phaser.Scene {
    constructor() {
        super({ key: "House5" });
        this.onMatchComplete = null; // Callback to update React state
        this.leftWords = []; 
        this.rightWords = []; 
        this.matchedPairs = []; 
    }
    preload() {
        this.load.image("house2", "assets/house2.png");
        this.load.spritesheet("guy", "assets/guy.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.image("collision", "assets/collision.png");
        this.doorOpenSound = this.sound.add("doorOpen", { volume: 0.2 });
        this.load.image("EifelT", "game_folder/assets/Eifel_Tower.png")
        this.load.image("Inspect", "game_folder/assets/Look_At_Me.png")
        this.load.audio("frrSong", "assets/frrSong.mp3")
    }

    create() {

        this.triggerApiCall();

        // Stop BG Music in House
        const backgroundMusic = this.sound.get("backgroundMusic");
        if (backgroundMusic) {
            backgroundMusic.stop();
        }

        if (!this.sound.get("frrSong")) {
            this.backgroundMusic = this.sound.add("frrSong", {
              loop: true,
              volume: 0.2,
            });
            this.backgroundMusic.play();
          } else {
            const backgroundMusic = this.sound.get("frrSong");
            if (!backgroundMusic.isPlaying) {
              backgroundMusic.play();
            }
          }

        this.cursors = this.input.keyboard.createCursorKeys();

        this.inspect = this.add
        .image(509, 195, "Inspect")
        .setOrigin(0, 0)  
        .setScale(.08)
        .setDepth(2)
        .setAlpha(1)

        this.E_T = this.add
        .image(590, 125, "EifelT")
        .setOrigin(0, 0)  
        .setScale(.05)
        .setDepth(2)
        .setAlpha(.6)
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
            .setOffset(6.5, 14)
            .setDepth(4)

        this.player.setCollideWorldBounds(true);

        // House collision and door data for HouseScene
        const houseCollisionBlocks = new HouseCollisionBlocks(this);
        const houseCollisionGroup = houseCollisionBlocks.getHouseBlocks();
        this.physics.add.collider(this.player, houseCollisionGroup);

        // Door Area for HouseScene
        this.doorArea = this.physics.add.staticGroup();
        const houseDoor = this.doorArea
            .create(460, 160, "collision")
            .setSize(30, 70);
        houseDoor.visible = false;

        this.physics.add.collider(
            this.player,
            this.doorArea,
            function (player, doorArea) {
                console.log("You are at the door!");
                this.doorOpenSound.play();
                this.scene.start("Main", { x: 500, y: 1300 });
            },
            null,
            this
        );

        // World bounds and camera
        this.physics.world.setBounds(0, 0, 750, 800);
        this.cameras.main.setBounds(0, 0, 800, 800);
    }

    triggerApiCall() {
        console.log("Triggering API call upon entering HouseScene5");
    
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
    
                let yOffsetLeft = 50; // Start Y position for the left side
                let yOffsetRight = 50; // Start Y position for the right side
    
                randomWords.forEach((item) => {
                    // Left Side (English words)
                    const leftText = this.add
                        .text(50, yOffsetLeft, item.englishWord, {
                            fontSize: "20px",
                            color: "#ffffff",
                        })
                        .setDepth(5)
                        .setInteractive(); // Enable interaction for the text
    
                    this.input.setDraggable(leftText);
                    leftText.wordName = item.englishWord; // Store the word's name
                    leftText.rank = item.rank; // Store the rank for matching
                    this.leftWords.push(leftText); // Add to leftWords array
    
                    // Right Side (French words)
                    const rightText = this.add
                        .text(850, yOffsetRight, item.targetWord, {
                            fontSize: "20px",
                            color: "#ffffff",
                        })
                        .setDepth(5)
                        .setInteractive(); // Enable interaction for the text
    
                    this.input.setDraggable(rightText);
                    rightText.wordName = item.targetWord; // Store the word's name
                    rightText.rank = item.rank; // Store the rank for matching
                    this.rightWords.push(rightText); // Add to rightWords array
    
                    yOffsetLeft += 70; // Space between each word on the left
                    yOffsetRight += 70; // Space between each word on the right
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
    }
    
    

    init(data) {
        if (data.onMatchComplete) {
            this.onMatchComplete = data.onMatchComplete;
        }
    }

    getRandomWords(array, count) {
        // Shuffle the array
        const shuffled = Phaser.Utils.Array.Shuffle(array);
        // Return the first `count` elements
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
    
                        // Display "Well done" message
                        this.showWellDoneMessage();
    
                        // Optionally, destroy the words
                        leftWord.destroy();
                        rightWord.destroy();
                    }
                }
            });
        });
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
update() {

    // Player movement logic
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
export default HouseScene5;

