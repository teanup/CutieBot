import { ExtendedClient } from "../structures/Client";

export default async function loadRoles(client: ExtendedClient): Promise<void> {
  client.log("Loading roles...", "loading")
  const roles = [
    { name: "player", id: process.env.ROLE_PLAYER },
    { name: "mod", id: process.env.ROLE_MOD },
    { name: "admin", id: process.env.ROLE_ADMIN },
    { name: "bot", id: process.env.ROLE_BOT },
    { name: "minecraft", id: process.env.ROLE_MINECRAFT },
    { name: "minigames", id: process.env.ROLE_MINIGAMES }
  ] as { name: string, id: string }[];

  roles.map(async (role) => {
    client.gRoles.set(role.name, role.id);
  });
  client.log(`Loaded ${roles.length} roles: ${roles.map((role) => role.name).join(", ")}`, "success");
}
