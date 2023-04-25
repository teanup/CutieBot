import { ExtendedModalType } from "../typings/Modal";

export class Modal {
  constructor(commandOptions: ExtendedModalType) {
    Object.assign(this, commandOptions);
  }
}
