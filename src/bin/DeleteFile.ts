import { unlink } from "fs/promises";
import { ExtendedClient } from "../structures/Client";

export default async function deleteFile(client: ExtendedClient, filePath: string, pathPrefix?: string): Promise<void> {
  const path = `${__dirname}/../${pathPrefix ? pathPrefix : ""}/${filePath}`;
  const keepfiles = process.env.PIC_EMBEDS_KEEPFILES_DIR;

  // Keep deleted files if set
  try {
    if (keepfiles) {
      await client.moveFile(filePath, filePath, client.picEmbedsTrashDir, keepfiles)
    } else {
      await unlink(path);
    }
  } catch (error) {
    throw error;
  }
}
