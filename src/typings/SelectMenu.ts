import { StringSelectMenuInteraction, GuildMember, PermissionResolvable } from "discord.js";
import { ExtendedClient } from "../structures/Client";

export interface ExtendedSelectMenuInteraction extends StringSelectMenuInteraction {
  member: GuildMember;
}

interface RunOptions {
  client: ExtendedClient,
  interaction: ExtendedSelectMenuInteraction
}

type RunFunction = (options: RunOptions) => any;

export type ExtendedSelectMenuType = {
  customId: string;
  userPermissions?: PermissionResolvable[];
  run: RunFunction;
};
