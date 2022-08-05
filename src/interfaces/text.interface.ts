export interface ITextConstructor {
  scene: Phaser.Scene;
  x: number;
  y: number;
  text: string;
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle;
}
