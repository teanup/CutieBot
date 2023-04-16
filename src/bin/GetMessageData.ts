import { ActionRowBuilder, BaseMessageOptions, MessageActionRowComponentBuilder } from "discord.js";
import { ExtendedClient } from "../structures/Client";

export default async function getMessageData(client: ExtendedClient, messageName: string): Promise<BaseMessageOptions> {
    const embed = await client.getText(`embeds.${messageName}`);
    let rows = await client.getComponents(messageName) as ActionRowBuilder<MessageActionRowComponentBuilder>[];

    return { embeds: [embed], components: rows };
}
