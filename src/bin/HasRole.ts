import { GuildMember } from "discord.js";
import { ExtendedClient } from "../structures/Client";

export default async function hasRole(client: ExtendedClient, member: GuildMember, role: string): Promise<boolean> {
  const roleId = client.gRoles.get(role);
  if (!roleId) return false;

  return member.roles.cache.has(roleId);
}
