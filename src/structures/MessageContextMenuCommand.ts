import { ExtendedMessageContextMenuCommandType } from "../typings/Command";

export class MessageContextMenuCommand {
  constructor(contextMenuOptions: ExtendedMessageContextMenuCommandType) {
    Object.assign(this, contextMenuOptions);
  }
}
