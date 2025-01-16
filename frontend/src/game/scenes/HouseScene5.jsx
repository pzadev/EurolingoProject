import Phaser from "phaser";
import HouseCollisionBlocks from "../imports/houseCollisionBlocks";

class HouseScene5 extends Phaser.Scene {
    constructor() {
        super({ key: "House5" });
    }

    preload() {
        this.load.image("house2", "assets/house2.png");
        this.load.spritesheet("guy", "assets/guy.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.image("collision", "assets/collision.png");
        this.doorOpenSound = this.sound.add("doorOpen", { volume: 0.5 });
        this.load.image("EifelT", "game_folder/assets/Eifel_Tower.png")
        this.load.image("Inspect", "game_folder/assets/Look_At_Me.png")
    }

    create() {

        this.triggerApiCall();

        // Stop BG Music in House
        const backgroundMusic = this.sound.get("backgroundMusic");
        if (backgroundMusic) {
            backgroundMusic.stop();
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
    
        fetch("https://pokeapi.co/api/v2/language/1/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("API Response:", data);
    
                // Extract and display language names
                const namesArray = data.names;
                let yOffset = 50; // Start Y position for text placement
    
                // Make text draggable
                namesArray.forEach((item) => {
                    const text = this.add
                        .text(50, yOffset, item.name, {
                            fontSize: "20px",
                            color: "#ffffff",
                        })
                        .setDepth(5) // Ensure the text is above other elements
                        .setInteractive(); // Enable interaction for the text
    
                    this.input.setDraggable(text); // Make the text draggable
    
                    // Add drag events for the text
                    this.input.on("dragstart", (pointer, gameObject) => {
                        if (gameObject === text) {
                            gameObject.setTint(0xff0000); // Highlight text during dragging
                        }
                    });
    
                    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
                        if (gameObject === text) {
                            gameObject.x = dragX; // Update the text's X position
                            gameObject.y = dragY; // Update the text's Y position
                        }
                    });
    
                    this.input.on("dragend", (pointer, gameObject) => {
                        if (gameObject === text) {
                            gameObject.clearTint(); // Remove the highlight after dragging
                        }
                    });
    
                    yOffset += 70; // Move down for the next text item
                });
            })
            .catch((error) => {
                console.error("API Error:", error);
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
export default HouseScene5;

