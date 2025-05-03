import { parseArgs } from "@std/cli"
import * as fs from "@std/fs"
import { Config, Dependency, JsonConfig } from "./types.ts"

/**
 * Gets the configuration from command line and config file
 * @returns DenoDeps configuration
 */
export const getConfig = async (): Promise<Config> => {
	let { entrypoint, output } = parseArgs(Deno.args, {
		string: ["entrypoint", "output"],
		default: { entrypoint: "", output: "" },
	})

	let dependencies: Dependency[] = []

	for (const cfgFile of ["deno.json", "jsr.json"]) {
		if (await fs.exists(cfgFile)) {
			const cfg = JSON.parse(await Deno.readTextFile(cfgFile)) as JsonConfig
			if (entrypoint === "") {
				entrypoint = cfg.denoDeps.entrypoint ?? "main.ts"
			}
			if (output === "") {
				output = cfg.denoDeps.output ?? "deps.json"
			}
			dependencies = cfg.denoDeps.dependencies ?? []
			break
		}
	}

	return { entrypoint, output, dependencies }
}
