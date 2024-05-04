import * as semver from "@std/semver"

/**
 * Removes a given prefix from a string if the string has it
 * @param s String
 * @param prefix Prefix to remove
 * @returns String without the prefix
 */
export const trimPrefix = (s: string, prefix: string): string => s.startsWith(prefix) ? s.slice(prefix.length) : s

/**
 * Removes a given suffix from a string if the string has it
 * @param s String
 * @param suffix Suffix to remove
 * @returns String without the suffix
 */
export const trimSuffix = (s: string, suffix: string): string => s.endsWith(suffix) ? s.slice(0, -suffix.length) : s

/**
 * Replace a given prefix from a string with another string
 * @param s String
 * @param prefix Prefix that should be replace
 * @param replacement Replacement string
 * @returns String with replaced prefix
 */
export const replacePrefix = (s: string, prefix: string, replacement: string): string =>
	s.startsWith(prefix) ? replacement + s.slice(prefix.length) : s

/**
 * Replace a given suffix from a string with another string
 * @param s String
 * @param suffix Suffix that should be replace
 * @param replacement Replacement string
 * @returns String with replaced suffix
 */
export const replaceSuffix = (s: string, suffix: string, replacement: string): string =>
	s.endsWith(suffix) ? s.slice(0, -suffix.length) + replacement : s

export type Maybe<T> = T | undefined | null

/**
 * Takes a list of element and returns a list with duplicates removed.
 * Undefined and null elements are ignored.
 * @param args Elements
 * @returns Array without duplicate elements
 */
export const unique = <T>(
	...args: Maybe<T>[]
): T[] => [...new Set([...args.filter((x) => x !== undefined && x !== null)] as T[])]

/**
 * Returns the newer of two versions
 * @param v1 First version (0.0.0 if undefined)
 * @param v2 Second version (0.0.0 if undefined)
 */
export const newerVersion = (
	v1 = "0.0.0",
	v2 = "0.0.0",
): string => (semver.greaterThan(semver.parse(v1), semver.parse(v2)) ? v1 : v2)
