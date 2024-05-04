import z from "zod"
import { SourceInfo } from "./common.ts"

const githubReg = /https:\/\/github.com\/([^\/]*)\/([^\/]*)(\.git)?/

const fileModel = z.object({
	name: z.string(),
	download_url: z.string().nullable(),
})

const userModel = z.object({
	name: z.string().nullable(),
}).transform((x) => x.name ?? undefined)

const repositoryModel = z.object({
	license: z.object({ name: z.string().nullable() }).nullable(),
}).transform((x) => x.license?.name)

const githubToken = Deno.env.get("GITHUB_TOKEN")

const githubApi = (req: string): Promise<unknown> =>
	fetch(`https://api.github.com${req}`, {
		headers: {
			"Accept": "application/vnd.github+json",
			"X-GitHub-Api-Version": "2022-11-28",
			...(githubToken ? { "Authorization": `Bearer ${githubToken}` } : {}),
		},
	}).then((x) => x.json())

/**
 * Fetches package information from a Github project
 * @param repository Repository URL in the format https://github.com/<user>/<repo>
 * @returns
 */
export const getGithubInfo = async (repository: string): Promise<SourceInfo> => {
	const repoRes = githubReg.exec(repository ?? "")
	if (!repoRes) {
		return {}
	}
	const user = repoRes[1]
	const repo = repoRes[2]

	return {
		repository: `https://github.com/${user}/${repo}`,
		license: await githubApi(`/repos/${user}/${repo}`)
			.then(repositoryModel.parse)
			.then((x) => x ?? undefined),
		licenseFile: await githubApi(`/repos/${user}/${repo}/contents`)
			.then(fileModel.array().parse)
			.then((x) =>
				x.find((x) => x.download_url && ["LICENSE", "LICENSE.MD", "LICENSE-MIT"].includes(x.name.toUpperCase()))
					?.download_url ?? undefined
			),
		authors: [
			await githubApi(`/users/${user}`)
				.then(userModel.parse)
				.then((x) => x ?? user),
		],
	}
}
