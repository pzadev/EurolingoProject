import Phaser from "phaser";
import HouseCollisionBlocks from "../imports/houseCollisionBlocks";

class HouseScene4 extends Phaser.Scene {
    constructor() {
        super({ key: "House4" });
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
    }

    create() {
        // Stop BG Music in House
        const backgroundMusic = this.sound.get("backgroundMusic");
        if (backgroundMusic) {
            backgroundMusic.stop();
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

        // World bounds and camera
        this.physics.world.setBounds(0, 0, 750, 800);
        this.cameras.main.setBounds(0, 0, 800, 800);
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

