import { rename } from "fs/promises";

export default async function moveFile(filePath: string, newFilePath: string, pathPrefix?: string, newPathPrefix?: string): Promise<void> {
  const path = `${__dirname}/../${
      pathPrefix ? pathPrefix : ""
    }/${filePath}`;
  const newPath = `${__dirname}/../${
      newPathPrefix ? newPathPrefix : ""
    }/${newFilePath}`;
  try {
    await rename(path, newPath);
  } catch (error) {
    throw error;
  }
}
