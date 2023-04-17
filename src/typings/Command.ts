import { ChatInputApplicationCommandData, MessageApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver, GuildMember, PermissionResolvable } from "discord.js";
import { ExtendedClient } from "../structures/Client";

export interface ExtendedCommandInteraction extends CommandInteraction {
  member: GuildMember;
}

interface RunOptions {
  client: ExtendedClient,
  interaction: ExtendedCommandInteraction,
  args: CommandInteractionOptionResolver
}

type RunFunction = (options: RunOptions) => any;

export type ExtendedCommandType = ExtendedChatInputCommandType | ExtendedMessageContextMenuCommandType;

export type ExtendedChatInputCommandType = {
  userPermissions?: PermissionResolvable[];
  run: RunFunction;
} & ChatInputApplicationCommandData;

export type ExtendedMessageContextMenuCommandType = {
  userPermissions?: PermissionResolvable[];
  run: RunFunction;
} & MessageApplicationCommandData;
