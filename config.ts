import { parseArgs } from "@std/cli"
import * as fs from "@std/fs"
import * as JSONC from "@std/jsonc"
import { Config, Dependency, JsonConfig } from "./types.ts"

/**
 * Gets the configuration from command line and config file
 * @returns DenoDeps configuration
 */
export async function getConfig(): Promise<Config> {
	let { entrypoint, output } = parseArgs(Deno.args, {
		string: ["entrypoint", "output"],
		default: { entrypoint: "", output: "" },
	})

	let dependencies: Dependency[] = []
	let excludeDependencies: RegExp[] = []

	for (const cfgFile of ["deno.json", "deno.jsonc", "jsr.json", "jsr.jsonc"]) {
		if (await fs.exists(cfgFile)) {
			const jsonParse = cfgFile.endsWith(".jsonc") ? JSONC.parse : JSON.parse
			const cfg = jsonParse(await Deno.readTextFile(cfgFile)) as JsonConfig
			if (entrypoint === "") {
				entrypoint = cfg.denoDeps?.entrypoint ?? "main.ts"
			}
			if (output === "") {
				output = cfg.denoDeps?.output ?? "deps.json"
			}
			dependencies = cfg.denoDeps?.dependencies ?? []
			excludeDependencies = cfg.denoDeps?.excludeDependencies?.map((x) => new RegExp(x)) ?? []
			break
		}
	}

	return { entrypoint, output, dependencies, excludeDependencies }
}
