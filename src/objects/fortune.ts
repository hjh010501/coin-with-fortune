import { ITextConstructor } from '../interfaces/text.interface';

export class Fortune extends Phaser.GameObjects.Text {
  constructor(aParams: ITextConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.text, aParams.textStyle);
  }
}
