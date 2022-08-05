import { GameScene } from './scenes/game-scene';

import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';



export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Coin Runner',
  url: 'https://github.com/digitsensitive/phaser3-typescript',
  version: '2.0',
  width: 768,
  height: 576,
  type: Phaser.AUTO,
  parent: 'game',
  scene: [GameScene],
  input: {
    keyboard: true
  },
  backgroundColor: '#3A99D9',
  plugins: {
    scene: [{
        key: 'rexUI',
        plugin: UIPlugin,
        mapping: 'rexUI'
    },
    // ...
    ]
  },
  render: { pixelArt: false, antialias: false },
  scale: {

    // ignore aspect ratio:
    //mode: Phaser.Scale.RESIZE,

    // keep aspect ratio:
    mode: Phaser.Scale.FIT,
    //mode: Phaser.Scale.ENVELOP, // larger than Scale.FIT
    //mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH, // auto width
    //mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT, // auto height

    autoCenter: Phaser.Scale.NO_CENTER,
    //autoCenter: Phaser.Scale.CENTER_BOTH,
    //autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    //autoCenter: Phaser.Scale.CENTER_VERTICALLY,

  },
  autoRound: false,
};
