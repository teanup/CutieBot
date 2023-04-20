import { Client } from "discord.js";

export class ClearClient extends Client {
  guildId = process.env.GUILD_ID;

  constructor() {
    super({ intents: ["Guilds"] });
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

    const date = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
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

  async start() {
    this.log("Starting bot...", "loading");
    await this.login(process.env.TOKEN);

    // Clear commands
    this.on("ready", async () => {
      await this.clearCommands(this.guildId);
      await this.clearCommands();

      this.log("Finished clearing commands, exiting...", "success");  
      this.destroy();
    })
  }

  async clearCommands(guildId?: string) {
    if (guildId) {
      const guildName = this.guilds.cache.get(guildId)?.name;
      this.log(`Clearing commands for guild ${guildName} [${guildId}]...`, "loading");
      await this.guilds.cache.get(guildId)?.commands.set([]);
      this.log(`Cleared commands for guild ${guildName} [${guildId}]`, "success");
    } else {
      this.log(`Clearing global commands...`, "loading");
      await this.application?.commands.set([]);
      this.log(`Cleared global commands`, "success");
    }
  }
}
