import { EmbedField } from "discord.js";
import { ChatInputCommand } from "../../structures/ChatInputCommand";

export default new ChatInputCommand({
  name: "ping",
  description: "Returns the bot's latency",
  run: async ({ client, interaction }) => {
    const message = await interaction.deferReply({
      fetchReply: true,
      ephemeral: true
    });

    const latency = (message.createdTimestamp - interaction.createdTimestamp);
    const APILatency = interaction.client.ws.ping;
    
    const emojiPicker = (ping: number) => {
      if (ping < 60) return ":horse:";
      if (ping < 120) return ":kangaroo:";
      if (ping < 240) return ":rabbit:";
      if (ping < 480) return ":turtle:";
      return ":snail:";
    };
    
    const embed = await client.getEmbed("texts.commands.chatInputs.ping");
    embed.fields = embed.fields as EmbedField[];
    embed.fields[0].value = embed.fields[0].value
      .replace("${latency}", `${latency}` )
      .replace("${emoji}", emojiPicker(latency));
    embed.fields[1].value = embed.fields[1].value
      .replace("${APILatency}", `${APILatency}`)
      .replace("${APIEmoji}", emojiPicker(APILatency));

    await interaction.editReply({
      embeds: [embed]
    });
  }
});
