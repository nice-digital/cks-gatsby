import libSlugify from "slugify";

/**
 * Async version of the native string replace function.
 * See https://stackoverflow.com/a/48032528/486434
 */
export const replaceAsync = async (
	str: string,
	regex: RegExp,
	replacer: (substring: string, ...args: string[]) => Promise<string>
): Promise<string> => {
	const promises: Promise<string>[] = [];
	str.replace(regex, (match, ...args): string => {
		const promise = replacer(match, ...args);
		promises.push(promise);
		return match;
	});
	const data = await Promise.all(promises);
	return str.replace(regex, () => data.shift() || "");
};

export const slugify = (str: string): string =>
	libSlugify(
		str
			.replace(/^Scenario: /gi, "")
			.replace(/ and /gi, " ")
			.replace("/", " "),
		{
			lower: true,
			remove: /[,*+~.()'"!?:@]/g,
		}
	);
