import { getOctokitClient, GitHubFile } from "./client";

interface CommitFilesOptions {
  token: string;
  owner: string;
  repo: string;
  files: GitHubFile[];
  commitMessage: string;
}

export async function commitFilesToGitHub({
  token,
  owner,
  repo,
  files,
  commitMessage,
}: CommitFilesOptions) {
  const octokit = getOctokitClient(token);

  const committedFiles = [];

  for (const file of files) {
    try {
      // Get current file SHA if exists
      let sha: string | undefined;
      try {
        const { data } = await octokit.repos.getContent({
          owner,
          repo,
          path: file.path,
        });
        if (!Array.isArray(data)) {
          sha = data.sha;
        }
      } catch (e) {
        // File doesn't exist yet, which is fine
      }

      const { data: updateData } = await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: file.path,
        message: commitMessage,
        content: Buffer.from(file.content).toString("base64"),
        sha,
      });

      committedFiles.push({
        path: file.path,
        sha: updateData.content?.sha || "",
      });
    } catch (error: any) {
      console.error(`Failed to commit file ${file.path}:`, error.message);
      throw error;
    }
  }

  return committedFiles;
}
