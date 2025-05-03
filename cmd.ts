import * as YAML from "@std/yaml"
import * as TOML from "@std/toml"
import * as path from "@std/path"
import { getConfig } from "./config.ts"
import { trimPrefix } from "./helpers.ts"
import { getDependencies } from "./parse.ts"
import { getGithubInfo, getJSRInfo, getNpmInfo } from "./sources/mod.ts"
import { Dependency } from "./types.ts"

const cfg = await getConfig()

const dependencies = [...cfg.dependencies, ...getDependencies(cfg.entrypoint)]
	.toSorted((a, b) => trimPrefix(a.name, "@") < trimPrefix(b.name, "@") ? -1 : 1)

const outputDependencies: Dependency[] = []

for (const input of dependencies) {
	const d = { ...input }

	if (cfg.excludeDependencies.some((r) => r.test(d.name))) {
		continue
	}

	try {
		const info = await (() => {
			switch (d.registry) {
				case "npm":
					return getNpmInfo(d.name, d.version)
				case "jsr":
					return getJSRInfo(d.name)
				default:
					return d
			}
		})()

		d.repository = info.repository
		d.authors = info.authors
		d.license = info.license
		d.licenseFile = info.licenseFile
	} catch {
		console.log(`[ERROR] ${d.name}: Failed to get data from registry`)
	}

	try {
		const info = await getGithubInfo(d.repository ?? "")
		d.repository = info.repository ?? d.registry
		d.authors = info.authors ?? d.authors
		d.license = info.license ?? d.license
		d.licenseFile = info.licenseFile ?? d.licenseFile
	} catch {
		console.log(`[ERROR] ${d.name}: Failed to get data from Github`)
	}

	// Remove undefined from values since YAML can't handle them
	for (const k of Object.keys(d) as (keyof Dependency)[]) {
		if (d[k] === undefined) {
			delete d[k]
		}
	}

	outputDependencies.push(d)

	console.log(`[OKAY] ${d.name}`)
}

// Write JSON or YAML version of the dependency output
const output = (() => {
	switch (path.extname(cfg.output)) {
		case ".yml":
		case ".yaml":
			return YAML.stringify(outputDependencies, { indent: 2, flowLevel: 2 })
		case ".toml":
			return TOML.stringify({ dependencies: outputDependencies }, {})
		default:
			return JSON.stringify(outputDependencies, null, 2)
	}
})()

await Deno.writeTextFile(cfg.output, output)
