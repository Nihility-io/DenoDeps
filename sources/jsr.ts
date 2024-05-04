import * as cheerio from "cheerio"
import { SourceInfo } from "./common.ts"
import { trimSuffix } from "../helpers.ts"

/**
 * Fetches package information from JSR.io
 * @param pkg Package name
 */
export const getJSRInfo = async (name: string): Promise<SourceInfo> => {
	const document = await fetch(`https://jsr.io/${name}`, {
		headers: { "Accept": "text/html" },
	}).then((x) => x.text()).then(cheerio.load)

	const gitUrl = [...document("a")]
		.find((x) =>
			x.attribs["class"].split(" ").map((x) => x.trim()).includes("chip") &&
			x.attribs["href"]?.startsWith("https://github.com")
		)
		?.attribs["href"]

	return {
		repository: gitUrl ? trimSuffix(gitUrl, ".git") : undefined,
	}
}
