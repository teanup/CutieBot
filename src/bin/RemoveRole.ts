import { GuildMember } from "discord.js";
import { ExtendedClient } from "../structures/Client";

export default async function removeRole(client: ExtendedClient, member: GuildMember, role: string): Promise<void> {
  const roleId = client.gRoles.get(role);
  if (!roleId) return;

  await member.roles.remove(roleId);
  client.log(`Removed ${role} role from ${member.user.username}#${member.user.discriminator} [${member.user.id}]`, "info");
}
