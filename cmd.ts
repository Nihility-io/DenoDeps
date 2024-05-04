import { parseArgs } from "@std/cli"
import { getDependencies } from "./parse.ts"
import { getDenolandInfo, getGithubInfo, getJSRInfo, getNpmInfo } from "./sources/index.ts"

export interface Dependency {
	registry: "npm" | "jsr" | "deno"
	name: string
	version: string
	license?: string
	authors?: string[]
	repository?: string
	licenseFile?: string
}

const { entrypoint, output } = parseArgs(Deno.args, {
	string: ["entrypoint", "output"],
	default: { entrypoint: "main.ts", output: "deps.json" },
})

const dependencies = getDependencies(entrypoint)

for (const d of dependencies) {
	try {
		const info = await (() => {
			switch (d.registry) {
				case "npm":
					return getNpmInfo(d.name, d.version)
				case "jsr":
					return getJSRInfo(d.name) ?? ""
				case "deno":
					return getDenolandInfo(d.name)
			}
		})()

		d.authors = info.authors
		d.license = info.license
		d.repository = info.repository
		d.licenseFile = info.licenseFile
	} catch {
		console.log(`[ERROR] ${d.name}: Failed to get data from registry`)
	}

	try {
		const info = await getGithubInfo(d.repository ?? "")
		d.license = info.license ?? d.license
		d.licenseFile = info.licenseFile ?? d.licenseFile
		d.authors = info.authors ?? d.authors
		d.repository = info.repository ?? d.registry
	} catch {
		console.log(`[ERROR] ${d.name}: Failed to get data from Github`)
	}

	console.log(`[OKAY] ${d.name}`)
}

// Write JSON version of the dependency output
Deno.writeTextFileSync(output, JSON.stringify(dependencies, null, 2))
