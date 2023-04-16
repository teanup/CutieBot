export default async function getText(textId: string): Promise<object> {
  const textPath = `${__dirname}/../texts/${textId.replace(/\./g, "/")}.json`;
  const contentPromise = await import(textPath);
  const content = JSON.stringify(contentPromise.default);
  const copy = JSON.parse(content);

  // Replace color with number
  if (copy.color) {
    copy.color = parseInt(copy.color, 16);
  }

  return copy
}
