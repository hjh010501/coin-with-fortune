import { Coin, Cookie } from '../objects/coin';
import { Player } from '../objects/player';
import { Fortune } from '../objects/fortune';

import axios from 'axios';
import { AttackButton } from '../objects/attack-button';
import { Monster } from '../objects/monster';

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;


const coin2fortune = [
  ["love", 2],
  ["fortune", 4],
  ["people", 3],
]

const cookieObtanables = [
  "food", "ethnic"
]

var CreateMenu = function (scene: any, items: any, onClick: any) {
  var exapndOrientation = 'y';
  var easeOrientation = 'y';

  var menu = scene.rexUI.add.menu({
    orientation: exapndOrientation,
    subMenuSide: 'right',

    popup: false,
    items: items,
    createBackgroundCallback: function (items: any) {
      var scene = items.scene;
      return scene.rexUI.add.roundRectangle(0, 0, 2, 2, 0, COLOR_PRIMARY);
    },

    createButtonCallback: function (item: any, index: any, items: any) {
      return scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 0),
        text: scene.add.text(0, 0, item.name, {
          fontSize: '20px'
        }),
        space: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
          icon: 10
        },
        typ : item.typ,
        scene : item.scene,
      })
    },

    // easeIn: 500,
    easeIn: {
      duration: 500,
      orientation: easeOrientation
    },

    // easeOut: 100,
    easeOut: {
      duration: 100,
      orientation: easeOrientation
    },

    // expandEvent: 'button.over',

    // space: { item: 10 }
  });

  menu
    .on('button.over', function (button: any) {
      button.getElement('background').setStrokeStyle(1, 0xffffff);
    })
    .on('button.out', function (button: any) {
      button.getElement('background').setStrokeStyle();
    })
    .on('button.click', function (button: any) {
      onClick(button);
    })

  return menu;
}

export class GameScene extends Phaser.Scene {
  private background: Phaser.GameObjects.Image;
  private coins: Coin[];
  private cookie: Cookie;
  private cookiesCollectedText: Phaser.GameObjects.Text;
  private intersectedCoins: Coin[];
  private coinsCollectedText: Phaser.GameObjects.Text;
  private collectedCoins: number;
  private cookieCounter : number;
  private player: Player;
  private fortunes: Fortune[];
  private attackbutton: AttackButton;
  private monster: Monster;
  private print: Phaser.GameObjects.Text;
  private gameState: "lose"|"win"|"run"|"ready";

  // api endpoint
  private axiosFortune = axios.create({
    baseURL: '/api',
  });

  constructor() {
    super({
      key: 'GameScene'
    });
  }

  preload(): void {
    this.load.spritesheet('playerWalk', './assets/images/player2.png',{ frameWidth: 61, frameHeight: 64 });
    this.load.image('background', './assets/images/background.png');
    this.load.image('player', './assets/images/coin.png');
    this.load.image('coin', './assets/images/coin.png');
    this.load.image('cookie', './assets/images/cookie.png');
    this.load.image('attackbutton', './assets/images/attackbutton.png');
    this.load.image('monster', './assets/images/monster.png');
    this.load.image('dead_monster', './assets/images/dead_monster.png');
  }

  init(): void {
    this.collectedCoins = 0;
    this.cookieCounter = 0;
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

    this.coins = range(1, 6).map(
      (v, idx) => new Coin({
        scene: this,
        x: Phaser.Math.RND.integerInRange(100, 500),
        y: Phaser.Math.RND.integerInRange(100, 500),
        texture: "coin",
      })
    );
    
    this.cookie = new Cookie({
      scene: this,
      x: Phaser.Math.RND.integerInRange(100, 500),
      y: Phaser.Math.RND.integerInRange(100, 500),
      texture: "cookie",
    });
    
    this.player = new Player({
      scene: this,
      x: this.sys.canvas.width / 2,
      y: this.sys.canvas.height / 2,
      texture: 'coin'
    }, {
      hp: 500
    });

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('playerWalk', { start: 0, end: 3 }),
      frameRate: 2,
      repeat: -1
  });

  this.player.play('walk');

    this.monster = new Monster(
      {
        scene: this,
        x: this.sys.canvas.width - 100,
        y: this.sys.canvas.height / 2,
        texture: 'monster'
      },
      {
        hp: 1000
      }
    );

    this.attackbutton = new AttackButton({
      scene: this,
      x: this.sys.canvas.width - 75,
      y: this.sys.canvas.height - 75,
      texture: 'attackbutton'
    });

    this.attackbutton.setInteractive();

    this.attackbutton.on(
      'pointerdown',
      (
        pointer: Phaser.Input.Pointer,
        objectsClicked: Phaser.GameObjects.GameObject[]
      ) => {
        this.updateMonsterStatus();
      }
    );


    // create texts
    this.coinsCollectedText = this.add.text(
      this.sys.canvas.width / 2,
      this.sys.canvas.height - 50,
      `💵: ${this.collectedCoins}`,
      {
        fontFamily: 'Arial',
        fontSize: 38 + 'px',
        stroke: '#fff',
        strokeThickness: 6,
        color: '#000000'
      }
    );

    this.cookiesCollectedText = this.add.text(
      this.sys.canvas.width / 4,
      this.sys.canvas.height - 50,
      `🥠: ${this.cookieCounter}`,
      {
        fontFamily: 'Arial',
        fontSize: 38 + 'px',
        stroke: '#fff',
        strokeThickness: 6,
        color: '#000000'
      },
    );

    // create fortune show buffers.
    this.fortunes = [];

    // create menu
    const items = coin2fortune.map(
      (tup) => {
        return {
          name: tup[0],
          children: [
            {
              name: tup[1].toString(),
              typ : tup[0]
            },
            {
              name: (2 * Number(tup[1])).toString(),
              typ : tup[0]
            },
            {
              name: (4 * Number(tup[1])).toString(),
              typ : tup[0]
            }
          ]
        }
      }
    )

    var scene = this;
    this.print = this.add.text(0, 0, '');

    var menu = CreateMenu(scene, items, function(button : any){
      button.scene.purchaseFortune(`${button.typ} ${button.text}`);
    })
    // @ts-ignore
    var topUI = this.rexUI.add.overlapSizer({
      anchor: {
        left: 'left', top: 'top', width: '100%', height: '100%'
      }
    })
      .add(menu, { align: 'left-center', expand: false })
      .layout()

  }


  update(): void {
      // update objects
      this.player.update();
      this.attackbutton.update();
      this.monster.update();

      // this.coin.update();
      this.coins.map((coin: Coin) => coin.update());


      this.intersectedCoins = this.coins.filter((coin: Coin) => Phaser.Geom.Intersects.RectangleToRectangle(
        this.player.getBounds(),
        coin.getBounds()
      ), []);

      // do the collision check
      if (this.intersectedCoins.length > 0) {
        this.updateCoinStatus();
      }

      if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.cookie.getBounds())) {
        this.updateCookieStatus();
      }

      if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.monster.getBounds())) {
        this.updatePlayerStatus();
      } else {
      this.add.text(
        this.sys.canvas.width / 2 - 100,
        this.sys.canvas.height / 2 - 50,
        this.gameState,
        {
          fontFamily: 'Arial',
          fontSize: 100 + 'px',
          stroke: '#fff',
          strokeThickness: 6,
          color: '#ff0000'
        }
      );}
  }

  private appendFortune(prefix : string) : void{
    this.axiosFortune.get(`/${prefix}`).then((res) => {
      this.fortunes.push(
        this.add.text(
          0,
          10 * this.fortunes.length,
          res.data.text.substring(0, 20),
          {
            fontFamily: 'Arial',
            fontSize: 8 + 'px',
            stroke: '#fff',
            strokeThickness: 6,
            color: '#000000'
          }
        ));
    });
  }

  private purchaseFortune(purchaseCommand : string){
    // "perl 10" 
    const purchaseCommandSplit = purchaseCommand.split(' ');
    const fortuneType = purchaseCommandSplit[0];
    const fortunePrice = Number(purchaseCommandSplit[1]);
    if(this.collectedCoins >= fortunePrice){
      console.log("Purchase: " + fortuneType );
     this.appendFortune(fortuneType);
     this.collectedCoins -= fortunePrice;
    }
  
  }

  private updateCoinStatus(): void {
    this.collectedCoins += this.intersectedCoins.length;
    this.coinsCollectedText.setText(`💵: ${this.collectedCoins}`);
    this.intersectedCoins.map((coin: Coin) => coin.changePosition());
  }

  private updateCookieStatus():void {
    this.cookieCounter += 1;
    this.cookiesCollectedText.setText(`🥠: ${this.cookieCounter}`);
    this.cookie.changePosition();
  }

  private updatePlayerStatus(): void {
    this.player.hitted(100);
    console.log(`Player hitted: ${this.player.getHp()}`);
  }


  private updateMonsterStatus(): void {
    this.monster.hitted(50);
    console.log(`Monster hitted: ${this.monster.getHp()}`);
  }


  private isEnd(): boolean {
    if(this.player.getHp() <= 0) {
      this.gameState = "lose";
      return true;
    } else if(this.monster.getHp() <= 0) {
      this.gameState = "win";
      return true;
    } else {
      this.gameState = "run";
      return false;
    }
  }
}
