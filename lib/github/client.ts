import { Octokit } from "@octokit/rest";

export type GitHubFile = {
  path: string;
  content: string;
};

export function getOctokitClient(token: string) {
  return new Octokit({
    auth: token,
  });
}
