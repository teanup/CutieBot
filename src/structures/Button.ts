import { ExtendedButtonType } from "../typings/Button";

export class Button {
  constructor(commandOptions: ExtendedButtonType) {
    Object.assign(this, commandOptions);
  }
}
