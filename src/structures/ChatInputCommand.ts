import { ExtendedChatInputCommandType } from "../typings/Command";

export class ChatInputCommand {
  constructor(commandOptions: ExtendedChatInputCommandType) {
    Object.assign(this, commandOptions);
  }
}
