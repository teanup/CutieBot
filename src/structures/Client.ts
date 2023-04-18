import { ApplicationCommandDataResolvable, Attachment, Client, ClientEvents, Collection, Message } from "discord.js";
import { glob } from "glob";
import { Event } from "./Event";
import { RegisterCommandOptions, ReplyType } from "../typings/Client";
import { ExtendedCommandType } from "../typings/Command";
import { ExtendedButtonType } from "../typings/Button";
import { ExtendedSelectMenuType } from "../typings/SelectMenu";

export class ExtendedClient extends Client {
  private importedFiles = new Map<string, any>();

  commands: Collection<string, ExtendedCommandType> = new Collection();
  buttons: Collection<string, ExtendedButtonType> = new Collection();
  selectMenus: Collection<string, ExtendedSelectMenuType> = new Collection();

  clientId = process.env.CLIENT_ID;
  guildId = process.env.GUILD_ID;

  replies: Collection<string, ReplyType> = new Collection();

  picChannelId = process.env.CHANNEL_PICTURES;

  constructor() {
    super({ intents: ["Guilds", "GuildMessages", "GuildMembers", "GuildMessageReactions", "MessageContent"] });
  }

  log(message: string, type?: "success" | "error" | "warn" | "info" | "loading") {
    const colorCodes = {
      reset: "\x1b[0m",
      dim: "\x1b[2m",
      red: "\x1b[31m",
      green: "\x1b[32m",
      yellow: "\x1b[33m",
      blue: "\x1b[34m",
    }

    const date = new Date().toLocaleString("en-UK", { timeZone: "Europe/Paris" });
    let logMessage = `[${date}] ${colorCodes.reset}`;

    switch (type) {
      case "success":
        logMessage +=`${colorCodes.green}[+]`;
        break;
      case "error":
        logMessage +=`${colorCodes.red}[-]`;
        break;
      case "warn":
        logMessage +=`${colorCodes.yellow}[!]`;
        break;
      case "info":
        logMessage +=`${colorCodes.blue}[*]`;
        break;
      case "loading":
        logMessage +=`${colorCodes.dim}[~]`;
        break;
      default:
        logMessage +=`[~]`;
        break;
    }

    logMessage += ` ${message}${colorCodes.reset}`;
    console.log(logMessage);
  }

  async importFile(filePath: string) {
    // Use cache if already imported
    if (this.importedFiles.has(filePath)) return this.importedFiles.get(filePath);
    // Import file
    const file = await import(filePath);
    this.importedFiles.set(filePath, file?.default);

    return file?.default;
  }

  async start() {
    this.log("Starting bot...", "loading");

    await this.registerModules();
    await this.login(process.env.TOKEN);
  }

  // Load methods
  LoadReplies = async () => (await this.importFile(`${__dirname}/../bin/LoadReplies.ts`))(this);
  setPresence = async () => (await this.importFile(`${__dirname}/../bin/SetPresence.ts`))(this);
  setCronJobs = async () => (await this.importFile(`${__dirname}/../bin/SetCronJobs.ts`))(this);
  getComponents = async (messageId: string) => (await this.importFile(`${__dirname}/../bin/GetComponents.ts`))(messageId);
  getMessageData = async (messageId: string) => (await this.importFile(`${__dirname}/../bin/GetMessageData.ts`))(this, messageId);
  getText = async (textId: string) => (await this.importFile(`${__dirname}/../bin/GetText.ts`))(textId);
  autoReply = async (message: Message, reply: ReplyType, defaultChance: number) => (await this.importFile(`${__dirname}/../bin/AutoReply.ts`))(message, reply, defaultChance);
  registerPic = async (message: Message, picUrl: string, fileName: string, attachment: Attachment) => (await this.importFile(`${__dirname}/../bin/RegisterPic.ts`))(this, message, picUrl, fileName, attachment);

  async registerCommands({ commands, guildId }: RegisterCommandOptions) {
    if (guildId) {
      const guildName = this.guilds.cache.get(guildId)?.name;
      this.log(`Registering commands for guild ${guildName} [${guildId}]...`, "loading");
      await this.guilds.cache.get(guildId)?.commands.set(commands);
      this.log(`Registered ${commands.length} commands for guild ${guildName} [${guildId}]`, "success");
    } else {
      this.log(`Registering global commands...`, "loading");
      await this.application?.commands.set(commands);
      this.log(`Registered ${commands.length} global commands`, "success");
    }
  }

  async unregisterCommands({ guildId }: { guildId?: string }) {
    if (guildId) {
      const guildName = this.guilds.cache.get(guildId)?.name;
      this.log(`Unregistering commands for guild ${guildName} [${guildId}]...`, "loading");
      await this.guilds.cache.get(guildId)?.commands.set([]);
      this.log(`Unregistered commands for guild ${guildName} [${guildId}]`, "success");
    } else {
      this.log(`Unregistering global commands...`, "loading");
      await this.application?.commands.set([]);
      this.log(`Unregistered global commands`, "success");
    }
  }

  async registerModules() {
    this.log("Registering modules...", "loading");

    // Load commands
    const appCommands: ApplicationCommandDataResolvable[] = [];
    const commandFiles = await glob(`${__dirname}/../commands/*/*.ts`);
    this.log(`Found ${commandFiles.length} commands: ${commandFiles.map((commandPath: string) => commandPath.split("/").pop()).join(", ")}`, "success");

    commandFiles.forEach(async (commandPath: string) => {
      const command: ExtendedCommandType = await this.importFile(commandPath);
      if (!command.name) return;

      this.commands.set(command.name, command);
      appCommands.push(command);
    });

    // Register commands
    this.on("ready", async () => {
      await this.registerCommands({
        commands: appCommands,
        guildId: this.guildId
      });
    });

    // Load buttons
    const buttonFiles = await glob(`${__dirname}/../components/buttons/*.ts`);
    this.log(`Found ${buttonFiles.length} buttons: ${buttonFiles.map((buttonPath: string) => buttonPath.split("/").pop()).join(", ")}`, "success");

    buttonFiles.forEach(async (buttonPath: string) => {
      const button: ExtendedButtonType = await this.importFile(buttonPath);
      if (!button.customId) return;

      this.buttons.set(button.customId, button);
    });

    // Load select menus
    const selectMenuFiles = await glob(`${__dirname}/../components/selectMenus/*.ts`);
    this.log(`Found ${selectMenuFiles.length} select menus: ${selectMenuFiles.map((selectMenuPath: string) => selectMenuPath.split("/").pop()).join(", ")}`, "success");

    selectMenuFiles.forEach(async (selectMenuPath: string) => {
      const selectMenu: ExtendedSelectMenuType = await this.importFile(selectMenuPath);
      if (!selectMenu.customId) return;

      this.selectMenus.set(selectMenu.customId, selectMenu);
    });

    // Load events
    const eventFiles = await glob(`${__dirname}/../events/*.ts`);
    this.log(`Found ${eventFiles.length} events: ${eventFiles.map((eventPath: string) => eventPath.split("/").pop()).join(", ")}`, "success");

    eventFiles.forEach(async (eventPath: string) => {
      const event: Event<keyof ClientEvents> = await this.importFile(eventPath);
      if (!event.event) return;

      this.on(event.event, event.run);
    });
  }
}
