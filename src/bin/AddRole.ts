import { GuildMember } from "discord.js";
import { ExtendedClient } from "../structures/Client";

export default async function addRole(client: ExtendedClient, member: GuildMember, role: string): Promise<void> {
  const roleId = client.gRoles.get(role);
  if (!roleId) return;

  await member.roles.add(roleId);
  client.log(`Added ${role} role to ${member.user.username}#${member.user.discriminator} [${member.user.id}]`, "info");
}
