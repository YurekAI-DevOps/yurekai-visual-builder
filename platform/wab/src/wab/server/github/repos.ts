import { GitRepository } from "@/wab/shared/ApiSchema";
import { Octokit } from "@octokit/core";
import { composePaginateRest } from "@octokit/plugin-paginate-rest";

export async function fetchGithubRepositories(
  octokit: Octokit,
  installationId?: number
): Promise<GitRepository[]> {
  const repositories: GitRepository[] = [];

  for await (const { repository } of repositoriesIterator(
    octokit,
    installationId
  )) {
    repositories.push({
      name: repository.full_name,
      installationId: installationId ?? 0,
      defaultBranch: repository.default_branch,
    });
  }

  return repositories;
}

function repositoriesIterator(octokit: Octokit, installationId?: number) {
  return {
    async *[Symbol.asyncIterator]() {
      const iterator = composePaginateRest.iterator(
        octokit,
        !installationId ? 
          "GET /user/repos" : 
          "GET /user/installations/{installation_id}/repositories",
        installationId ? 
          { installation_id: installationId } : 
          {}
      );

      for await (const { data: repositories } of iterator) {
        for (const repository of repositories) {
          yield { repository };
        }
      }
    },
  };
}