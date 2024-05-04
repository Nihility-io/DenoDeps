import z from "zod"
import { replacePrefix, trimPrefix, trimSuffix, unique } from "../helpers.ts"
import { SourceInfo } from "./common.ts"

const RepositoryModel = z.object({ url: z.string() })
	.transform((x): string => {
		let repo = x.url ?? ""
		repo = trimPrefix(repo, "git+")
		repo = replacePrefix(repo, "ssh://git@", "https://")
		repo = replacePrefix(repo, "git://", "https://")
		repo = trimSuffix(repo, ".git")
		return repo
	})

const UserModel = z.object({ name: z.string() })
	.transform((x) => x.name)

const PackageModel = z.object({
	license: z.string().nullable(),
	repository: RepositoryModel.nullable(),
	_npmUser: UserModel.nullable(),
	maintainers: UserModel.array().nullable(),
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
		.then((x) => PackageModel.parse(x))
