import { IImageConstructor } from '../interfaces/image.interface';

interface MonsterData {
  hp: number;
}
export class Monster extends Phaser.GameObjects.Image {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private walkingSpeed: number;
  private hp: number;
  private hpText: Phaser.GameObjects.Text;
  private isDead: boolean = false;

  constructor(aParams: IImageConstructor, data: MonsterData) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture);

    this.initVariables(data.hp);
    this.initImage();
    this.initInput();
    this.walkingSpeed = 10;

    this.scene.add.existing(this);
    this.hpText = this.scene.add.text(this.x, this.y - 20, `HP: ${this.hp}`);
  }

  private initVariables(hp: number): void {
    this.hp = hp;
  }

  private initImage(): void {
    this.setOrigin(0.5, 0.5);
  }

  private initInput(): void {
    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  update(): void {
    // this.handleInput();
    this.moveRandomly();
    this.hpText.destory(true);
    this.hpText = this.scene.add.text(this.x, this.y - 20, this.hpText.text);
  }

  public getHp(): number {
    return this.hp;
  }

  public hitted(damage: number): void {
    if (this.hp <= 0) {
      this.isDead = true;
      this.setTexture('dead_monster');
      this.hpText.setText(`You Win!`);
      this.walkingSpeed = 0;
      return;
    }
    this.hp -= damage;
    this.hpText.setText(`HP: ${this.hp}`);
  }

  private handleInput(): void {
    // if (this.cursors.right.isDown) {
    //   this.x += this.walkingSpeed;
    //   this.setFlipX(false);
    // } else if (this.cursors.left.isDown) {
    //   this.x -= this.walkingSpeed;
    //   this.setFlipX(true);
    // } else if (this.cursors.up.isDown) {
    //   this.y -= this.walkingSpeed;
    // } else if (this.cursors.down.isDown) {
    //   this.y += this.walkingSpeed;
    // }
  }
  private moveRandomly(): void {
    // True: right/upper; False: left/lower
    const direction:boolean[][] = [[false, false], [false, true], [true, false], [true, true]];
    const nxt: number = Phaser.Math.RND.integerInRange(0, 3);
    
    if (direction[nxt][0]) {
      if(this.x < this.scene.sys.canvas.width + 20){
        this.x += this.walkingSpeed;
        this.setFlipX(false);
      }
    } else if(this.x > -20){
      this.x -= this.walkingSpeed;
      this.setFlipX(true);
    }
    if (direction[nxt][1]) {
      if(this.y > -20) {
        this.y -= this.walkingSpeed;
      }
    } else if (this.y < this.scene.sys.canvas.height + 20){
        this.y += this.walkingSpeed;
    }
  }
}
