import z from "zod"
import { replacePrefix, trimPrefix, trimSuffix, unique } from "../helpers.ts"
import { SourceInfo } from "./common.ts"

const repositoryModel = z.object({ url: z.string() })
	.transform((x): string => {
		let repo = x.url ?? ""
		repo = trimPrefix(repo, "git+")
		repo = replacePrefix(repo, "ssh://git@", "https://")
		repo = replacePrefix(repo, "git://", "https://")
		repo = trimSuffix(repo, ".git")
		return repo
	})

const userModel = z.object({ name: z.string() })
	.transform((x) => x.name)

const packageModel = z.object({
	license: z.string().nullable(),
	repository: repositoryModel.nullable(),
	_npmUser: userModel.nullable(),
	maintainers: userModel.array().nullable(),
}).transform((x): SourceInfo => {
	const repo = x.repository ?? ""
	return {
		license: x.license ?? undefined,
		repository: repo.startsWith("https://github.com") ? repo : undefined,
		authors: unique(x._npmUser, ...(x.maintainers ?? [])),
	}
})

/**
 * Fetches package information from NPM
 * @param pkg Package name
 * @param version Package version
 */
export const getNpmInfo = (pkg: string, version: string): Promise<SourceInfo> =>
	fetch(`https://registry.npmjs.com/${pkg}/${version}`)
		.then((x) => x.json())
		.then(packageModel.parse)
