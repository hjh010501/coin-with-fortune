import { IImageConstructor } from '../interfaces/image.interface';

interface PlayerData {
  hp: number,
};

export class Player extends Phaser.GameObjects.Sprite {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private walkingSpeed: number;
  private hp: number;
  private hpText: Phaser.GameObjects.Text;
  private isDead: boolean = false;

  constructor(aParams: IImageConstructor, data:PlayerData) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture);

    this.initVariables(data);
    this.initImage();
    this.initInput();

    this.scene.add.existing(this);
    this.hpText = this.scene.add.text(this.x, this.y - 20, `HP: ${this.hp}`);
  }

  private initVariables(data:PlayerData): void {
    this.walkingSpeed = 5;
    this.hp = data.hp;
  }

  private initImage(): void {
    this.setOrigin(0.5, 0.5);
  }

  private initInput(): void {
    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  public getHp(): number {
    return this.hp;
  }

  public hitted(damage: number): void {
    this.hp -= damage;
    this.x -= 50;
    if (this.hp <= 0) {
      this.hp = 0;
      this.isDead = true;
      this.setTexture('dead_player');
      this.hpText.setText(`You Lose...`);
    }
    this.hpText.text = `HP: ${this.hp}`;
  }

  update(): void {
    this.handleInput();
    this.hpText.destroy(true);
    this.hpText = this.scene.add.text(this.x, this.y - 20, this.hpText.text);
  }

  private handleInput(): void {
    if(!this.isDead){
      if (this.cursors.right.isDown && this.x < this.scene.sys.canvas.width) {
        this.x += this.walkingSpeed;
        this.setFlipX(false);
      } else if (this.cursors.left.isDown && this.x > 0) {
        this.x -= this.walkingSpeed;
        this.setFlipX(true);
      } else if (this.cursors.up.isDown && this.y > 0) {
        this.y -= this.walkingSpeed;
      } else if (this.cursors.down.isDown && this.y < this.scene.sys.canvas.height) {
        this.y += this.walkingSpeed;
      }
    }
  }
}
