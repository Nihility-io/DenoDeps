import { z } from "zod"
import { newerVersion } from "./helpers.ts"
import { Dependency } from "./types.ts"

const infoJson = z.object({
	packages: z.record(z.string()).transform((x) =>
		Object.values(x).flatMap((x) => {
			const m = /@(?<scope>[^\/]+)\/(?<pkg>[^@]+)@(?<version>.+)/.exec(x)
			if (m === null) {
				console.error(`Unsupported package ${x}`)
				return []
			}

			return {
				registry: "jsr",
				name: `@${m.groups!.scope}/${m.groups!.pkg}`,
				version: m.groups!.version,
			} as Dependency
		})
	),
	npmPackages: z.record(z.object({ name: z.string(), version: z.string() }))
		.transform((x) =>
			Object.values(x).map(({ name, version }) => ({ registry: "npm", name, version }) as Dependency)
		),
}).transform((x) => [...x.packages, ...x.npmPackages])

/**
 * Uses `deno info` in order to find all dependencies
 * @param entrypoint Entrypoint script (e.g. main.ts)
 * @returns Parsed dependencies
 */
export function getDependencies(entrypoint: string): Dependency[] {
	const denoDeps = infoJson.parse(JSON.parse(new TextDecoder("utf8")
		.decode(new Deno.Command("deno", { args: ["info", "--json", entrypoint] }).outputSync().stdout)))

	const deps: Record<string, Dependency> = {}

	for (const dep of denoDeps) {
		if (deps[dep.name]) {
			deps[dep.name].version = newerVersion(deps[dep.name].version, dep.version)
		} else {
			deps[dep.name] = dep
		}
	}

	return Object.values(deps)
}
