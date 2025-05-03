import { SourceInfo } from "../types.ts"
import z from "zod"

const packageModel = z.object({
	scope: z.string(),
	name: z.string(),
	githubRepository: z.object({ owner: z.string(), name: z.string() }).nullable()
		.transform((x) => x ? `https://github.com/${x.owner}/${x.name}` : undefined),
}).transform(({ scope, githubRepository: repository }) => ({ authors: [scope], repository }) as SourceInfo)

/**
 * Fetches package information from JSR.io
 * @param pkg Package name
 */
export const getJSRInfo = (name: string): Promise<SourceInfo> => {
	const [scope, pkg] = name.split("/")
	return fetch(`https://api.jsr.io/scopes/${scope.substring(1)}/packages/${pkg}`)
		.then((x) => x.json())
		.then(packageModel.parse)
}
