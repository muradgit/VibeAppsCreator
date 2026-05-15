import { getOctokitClient } from "./client";

interface SyncRepoOptions {
  token: string;
  owner: string;
  repo: string;
  path?: string;
}

export async function fetchRepoContents({
  token,
  owner,
  repo,
  path = "",
}: SyncRepoOptions): Promise<Record<string, string>> {
  const octokit = getOctokitClient(token);
  const files: Record<string, string> = {};

  async function recursiveFetch(currentPath: string) {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: currentPath,
    });

    if (Array.isArray(data)) {
      for (const item of data) {
        if (item.type === "dir") {
          await recursiveFetch(item.path);
        } else if (item.type === "file") {
          const fileData = await octokit.repos.getContent({
            owner,
            repo,
            path: item.path,
          });
          if (!Array.isArray(fileData) && "content" in fileData) {
              const content = Buffer.from(fileData.content as string, "base64").toString("utf-8");
              files[item.path] = content;
          }
        }
      }
    } else if ("content" in data) {
      const content = Buffer.from(data.content as string, "base64").toString("utf-8");
      files[currentPath] = content;
    }
  }

  await recursiveFetch(path);
  return files;
}
