import { Octokit } from "@octokit/rest";

interface FileCommit {
  path: string;
  content: string;
}

export async function commitFilesToRepo(
  octokit: Octokit,
  owner: string,
  repo: string,
  files: FileCommit[],
  commitMessage: string
): Promise<string> {
  const repoData = await octokit.repos.get({ owner, repo });
  const branch = repoData.data.default_branch;

  const { data: refData } = await octokit.git.getRef({
    owner,
    repo,
    ref: `heads/${branch}`,
  });
  const latestCommitSha = refData.object.sha;

  const { data: commitData } = await octokit.git.getCommit({
    owner,
    repo,
    commit_sha: latestCommitSha,
  });
  const baseTreeSha = commitData.tree.sha;

  const fileBlobs = await Promise.all(
    files.map(async (file) => {
      const { data: blobData } = await octokit.git.createBlob({
        owner,
        repo,
        content: file.content,
        encoding: "utf-8",
      });
      return {
        path: file.path,
        mode: "100644" as const,
        type: "blob" as const,
        sha: blobData.sha,
      };
    })
  );

  const { data: treeData } = await octokit.git.createTree({
    owner,
    repo,
    base_tree: baseTreeSha,
    tree: fileBlobs,
  });

  const { data: newCommitData } = await octokit.git.createCommit({
    owner,
    repo,
    message: commitMessage,
    tree: treeData.sha,
    parents: [latestCommitSha],
  });

  await octokit.git.updateRef({
    owner,
    repo,
    ref: `heads/${branch}`,
    sha: newCommitData.sha,
  });

  return newCommitData.sha;
}
