export const formatBytes = (b: number) => {
  const i = ~~(Math.log2(b) / 10);
  return `${(b / 1024 ** i).toFixed(2) + ("KMGTPEZY"[i - 1] || "")}B`;
};
