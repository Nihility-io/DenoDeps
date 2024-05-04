import { match, P } from "ts-pattern"
import { newerVersion, trimPrefix } from "./helpers.ts"

export interface Dependency {
	registry: "npm" | "jsr" | "deno"
	name: string
	version: string
	license?: string
	authors?: string[]
	repository?: string
	licenseFile?: string
}

const npmReg = /npm:\/(.*)@(.*)/
const jsrReg = /https:\/\/jsr.io\/@([^\/]*)\/([^\/]*)\/(\d+\.\d+\.\d+)\/.*/
const denoX = /https:\/\/deno\.land\/x\/([^@]*)@([^\/]*)\/.*/
const denoStd = /https:\/\/deno\.land\/std@([^\/]*)\/.*/
const esmReg = /https:\/\/esm\.sh\/\*?(@?[^@]*)@([^\/]*).*/
const esmIgnore = /https:\/\/esm\.sh\/(v\d+|stable).*/

/**
 * Parses a dependency string
 * @param s Dependency string (e.g. npm:/postcss@8.4.35)
 * @returns Parsed dependency
 */
const parsePackageString = (s: string): Dependency | undefined =>
	match<string, Dependency | undefined>(s)
		.with(P.string.regex(jsrReg), () => {
			const [_, ns, name, version] = jsrReg.exec(s)!
			return { registry: "jsr", name: `@${ns}/${name}`, version } satisfies Dependency
		})
		.with(P.string.regex(denoX), () => {
			const [_, name, version] = denoX.exec(s)!
			return { registry: "deno", name, version } satisfies Dependency
		})
		.with(P.string.regex(denoStd), () => {
			const [_, version] = denoStd.exec(s)!
			return { registry: "deno", name: "std", version } satisfies Dependency
		})
		.with(P.string.regex(esmIgnore), () => undefined)
		.with(P.string.regex(esmReg), () => {
			const [_, name, version] = esmReg.exec(s)!
			return { registry: "npm", name, version } satisfies Dependency
		})
		.with(
			P.string.regex(npmReg),
			() => {
				const [_, name, version] = npmReg.exec(s)!
				const res = /(.*)@(\d+\.\d+\.\d+)_.*/.exec(name)
				return {
					registry: "npm",
					name: res ? res[1]! : name,
					version: res ? res[2]! : version,
				} satisfies Dependency
			},
		)
		.otherwise(() => {
			console.log(`[WARN] Unsupported dependency ${s}`)
			return undefined
		})

/**
 * Uses `deno info` in order to find all dependencies
 * @param entrypoint Entrypoint script (e.g. main.ts)
 * @returns Parsed dependencies
 */
export const getDependencies = (entrypoint: string): Dependency[] => {
	const denoDeps = new TextDecoder("utf8")
		.decode(new Deno.Command("deno", { args: ["info", entrypoint] }).outputSync().stdout).split("\n")

	const deps: Record<string, Dependency> = {}

	for (const dep of denoDeps) {
		const matches = /(npm:|https:)([^\s|]*)\s/.exec(dep)
		if (!matches) {
			continue
		}
		const res = parsePackageString(matches[1] + matches[2])
		if (!res) {
			continue
		}

		if (deps[res.name]) {
			deps[res.name].version = newerVersion(deps[res.name].version, res.version)
		} else {
			deps[res.name] = res
		}
	}

	return Object.values(deps).toSorted((a, b) => trimPrefix(a.name, "@") < trimPrefix(b.name, "@") ? -1 : 1)
}
