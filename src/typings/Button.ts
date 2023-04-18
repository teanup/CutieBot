import { ButtonInteraction, GuildMember, PermissionResolvable } from "discord.js";
import { ExtendedClient } from "../structures/Client";

export interface ExtendedButtonInteraction extends ButtonInteraction {
  member: GuildMember;
}

interface RunOptions {
  client: ExtendedClient,
  interaction: ExtendedButtonInteraction
}

type RunFunction = (options: RunOptions) => any;

export type ExtendedButtonType = {
  customId: string;
  userPermissions?: PermissionResolvable[];
  run: RunFunction;
};