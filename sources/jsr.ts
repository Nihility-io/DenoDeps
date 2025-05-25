import z from "zod"
import { SourceInfo } from "../types.ts"

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
export async function getJSRInfo(name: string): Promise<SourceInfo> {
	const [scope, pkg] = name.split("/")
	const res = await fetch(`https://api.jsr.io/scopes/${scope.substring(1)}/packages/${pkg}`)
	const data = await res.json()
	return packageModel.parse(data)
}
