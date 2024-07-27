import Phaser from 'phaser';
import MainMenuScene from './scenes/MainMenuScene';

const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 270,
  scene: [MainMenuScene]
};

new Phaser.Game(config);
