import { App } from "@octokit/app";
import { composePaginateRest } from "@octokit/plugin-paginate-rest";
import { getGithubApp } from "./app";
import { Octokit } from "@octokit/core";
import { getGithubToken } from '@/wab/server/secrets';
export async function fetchGithubBranches(
  installationId: number,
  repository: string
) {
  const [owner, repo] = repository.split("/");
  const branches: string[] = [];

  let app: App | null = null;

  if (installationId) {
    app = getGithubApp();
  }

  for await (const { branch } of branchesIterator(
    app,
    installationId,
    owner,
    repo
  )) {
    branches.push(branch.name);
  }

  return branches;
}

function branchesIterator(
  app: App | null,
  installationId: number,
  owner: string,
  repo: string
) {
  return {
    async *[Symbol.asyncIterator]() {
      let octokit;

      if (!app) {
        octokit = new Octokit({ auth: getGithubToken() });  
      } else {
        octokit = await app?.getInstallationOctokit(installationId);
      }

      const iterator = composePaginateRest.iterator(
        octokit,
        "GET /repos/{owner}/{repo}/branches",
        { owner, repo }
      );

      for await (const { data: branches } of iterator) {
        for (const branch of branches) {
          yield { branch };
        }
      }
    },
  };
}

export async function getDefaultBranch(
  installationId: number,
  owner: string,
  repo: string
) {
  
  let app, octokit;

  if (!installationId) {
    octokit = new Octokit({ auth: getGithubToken() });
  } else {
    app = getGithubApp();
    octokit = await app.getInstallationOctokit(installationId);
  }

  const { data } = await octokit.request("GET /repos/{owner}/{repo}", {
    owner,
    repo,
  });
  return data.default_branch;
}
