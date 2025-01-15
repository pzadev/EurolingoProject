import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import { MainScene } from "./game/scenes/MainScene";
import HouseScene1 from "./game/scenes/HouseScene1";
import HouseScene2 from "./game/scenes/HouseScene2";
import HouseScene3 from "./game/scenes/HouseScene3";
import HouseScene4 from "./game/scenes/HouseScene4";
import HouseScene5 from "./game/scenes/HouseScene5";

const PhaserGame = () => {
    const gameContainer = useRef(null);

    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: 1000,
            height: 600,
            physics: {
                default: "arcade",
                arcade: {
                    debug: false, // Set to true to debug/see hitboxes
                },
            },
            scene: [
                MainScene,
                HouseScene1,
                HouseScene2,
                HouseScene3,
                HouseScene4,
                HouseScene5,
            ],
        };

        const game = new Phaser.Game(config);

        gameContainer.current.appendChild(game.canvas);

        // Clean up the game instance when the component unmounts
        return () => {
            game.destroy(true);
        };
    }, []);

    return <div ref={gameContainer}></div>;
};

export default PhaserGame;

