import { writeFile } from "fs/promises";

export default async function editFile(data: any, filePath: string, pathPrefix?: string): Promise<void> {
  const path = `${__dirname}/../${pathPrefix ? pathPrefix : ""}/${filePath}`;
  try {
    await writeFile(path, data);
  } catch (error) {
    throw error;
  }
}
