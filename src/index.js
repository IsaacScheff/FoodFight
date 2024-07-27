import Phaser from 'phaser';
import CombatScene from './scenes/CombatScene';
import MainMenuScene from './scenes/MainMenuScene';
import OptionScene from './scenes/OptionScene';
import NonCombatScene from './scenes/NonCombatScene';

const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 270,
  zoom: 2,
  scene: [MainMenuScene, OptionScene, CombatScene, NonCombatScene]
};

new Phaser.Game(config);
