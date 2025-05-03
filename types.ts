export interface SourceInfo {
	repository?: string
	authors?: string[]
	license?: string
	licenseFile?: string
}

export interface Dependency extends SourceInfo {
	registry?: "npm" | "jsr"
	name: string
	version: string
}

export interface DenoDepsConfig {
	entrypoint?: string
	output?: string
	dependencies?: Dependency[]
	excludeDependencies?: string[]
}

export interface JsonConfig extends Record<string, unknown> {
	denoDeps: DenoDepsConfig
}

export interface Config {
	entrypoint: string
	output: string
	dependencies: Dependency[]
	excludeDependencies: RegExp[]
}
