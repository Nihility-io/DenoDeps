import z from "zod"
import { trimSuffix } from "../helpers.ts"
import { SourceInfo } from "./common.ts"

const uploadOptionsModel = z.object({
	type: z.string(),
	repository: z.string(),
}).transform(({ type, repository }) =>
	type === "github" ? trimSuffix(`https://github.com/${repository}`, ".git") : undefined
)

const denolandModel = z.object({
	upload_options: uploadOptionsModel.optional(),
}).transform((x): SourceInfo => ({ repository: x.upload_options }))

/**
 * Fetches package information from Denoland
 * @param pkg Package name
 */
export const getDenolandInfo = (pkg: string): Promise<SourceInfo> =>
	fetch(`https://apiland.deno.dev/v2/modules/${pkg}`)
		.then((x) => x.json())
		.then((x) => denolandModel.parse(x))
