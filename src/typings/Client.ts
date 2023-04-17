import { ApplicationCommandDataResolvable } from "discord.js";

export interface RegisterCommandOptions {
  commands: ApplicationCommandDataResolvable[];
  guildId?: string;
}

export interface ReplyType {
  regex: RegExp;
  emoji: string;
  replies: string[];
}
