import { IImageConstructor } from '../interfaces/image.interface';

export class AttackButton extends Phaser.GameObjects.Image {
  constructor(aParams: IImageConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture);

    this.initImage();
  }

  private initImage(): void {
    this.setOrigin(0.5, 0.5);
  }
}
