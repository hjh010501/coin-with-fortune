import { Coin } from '../objects/coin';
import { Player } from '../objects/player';
import { Fortune } from '../objects/fortune';

import axios from 'axios';
import { AttackButton } from '../objects/attack-button';

export class GameScene extends Phaser.Scene {
  private background: Phaser.GameObjects.Image;
  private coins: Coin[];
  private intersectedCoin: Coin;
  private coinsCollectedText: Phaser.GameObjects.Text;
  private collectedCoins: number;
  private player: Player;
  private fortunes: Fortune[];
  private attackbutton: AttackButton;

  // api endpoint
  private axiosFortune = axios.create({
    baseURL: 'https://fortuneapi.herokuapp.com/'
  });

  constructor() {
    super({
      key: 'GameScene'
    });
  }

  preload(): void {
    this.load.image('background', './assets/images/background.png');
    this.load.image('player', './assets/images/player.png');
    this.load.image('coin', './assets/images/coin.png');
    this.load.image('attackbutton', './assets/images/attackbutton.png');
  }

  init(): void {
    this.collectedCoins = 0;
  }

  create(): void {
    // create background
    this.background = this.add.image(0, 0, 'background');
    this.background.setOrigin(0, 0);

    // create objects
    const range: (arg0: number, arg1: number) => number[] = (
      start: number,
      end: number
    ) => (start < end ? [start, ...range(start + 1, end)] : []);
    this.coins = range(1, Phaser.Math.RND.integerInRange(1, 6)).map(
      (v) =>
        new Coin({
          scene: this,
          x: Phaser.Math.RND.integerInRange(100, 700),
          y: Phaser.Math.RND.integerInRange(100, 500),
          texture: 'coin'
        })
    );

    // this.coin = new Coin({
    //   scene: this,
    //   x: Phaser.Math.RND.integerInRange(100, 700),
    //   y: Phaser.Math.RND.integerInRange(100, 500),
    //   texture: 'coin'
    // });
    this.player = new Player({
      scene: this,
      x: this.sys.canvas.width / 2,
      y: this.sys.canvas.height / 2,
      texture: 'player'
    });

    this.attackbutton = new AttackButton({
      scene: this,
      x: 100,
      y: 100,
      texture: 'player'
    });

    // create texts
    this.coinsCollectedText = this.add.text(
      this.sys.canvas.width / 2,
      this.sys.canvas.height - 50,
      this.collectedCoins + '',
      {
        fontFamily: 'Arial',
        fontSize: 38 + 'px',
        stroke: '#fff',
        strokeThickness: 6,
        color: '#000000'
      }
    );

    // create fortune show buffers.
    this.fortunes = [];
  }

  update(): void {
    // update objects
    this.player.update();
    this.attackbutton.update();
    // this.coin.update();
    this.coins.map((coin: Coin) => coin.update());

    const intersectedCoins: boolean[] = this.coins.map((coin: Coin) => {
      return Phaser.Geom.Intersects.RectangleToRectangle(
        this.player.getBounds(),
        coin.getBounds()
      );
    });
    // do the collision check
    if (intersectedCoins.some((v: boolean) => v)) {
      this.intersectedCoin = this.coins[intersectedCoins.indexOf(true)];
      this.updateCoinStatus();
    }
  }

  private updateCoinStatus(): void {
    this.collectedCoins++;
    this.coinsCollectedText.setText(this.collectedCoins + '');
    // this.coins.map((coin: Coin) => coin.changePosition());
    this.intersectedCoin.changePosition();

    const some_fortune = 'temp_fortune';
    const fortune_obj = this.add.text(
      this.sys.canvas.width / 2,
      this.sys.canvas.height - 50,
      some_fortune,
      {
        fontFamily: 'Arial',
        fontSize: 38 + 'px',
        stroke: '#fff',
        strokeThickness: 6,
        color: '#000000'
      }
    );

    //console.log(some_fortune);
  }
}
