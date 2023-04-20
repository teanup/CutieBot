import { ModalSubmitInteraction, GuildMember, PermissionResolvable } from "discord.js";
import { ExtendedClient } from "../structures/Client";

export interface ExtendedModalInteraction extends ModalSubmitInteraction {
  member: GuildMember;
  picMessageId?: string;
  picFileName?: string;
}

interface RunOptions {
  client: ExtendedClient,
  interaction: ExtendedModalInteraction
}

type RunFunction = (options: RunOptions) => any;

export type ExtendedModalType = {
  customId: string;
  userPermissions?: PermissionResolvable[];
  run: RunFunction;
};
