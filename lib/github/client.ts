import { Octokit } from "@octokit/rest";

export function createOctokitClient(token: string): Octokit {
  return new Octokit({ auth: token });
}
