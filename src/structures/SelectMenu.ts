import { ExtendedSelectMenuType } from "../typings/SelectMenu";

export class SelectMenu {
  constructor(commandOptions: ExtendedSelectMenuType) {
    Object.assign(this, commandOptions);
  }
}
