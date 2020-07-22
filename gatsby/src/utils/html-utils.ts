export const stripHtmlComments = (html: string): string =>
	html.replace(/<!--[\s\S]*?(?:-->)/g, "");

export const stripHtmlTags = (html: string): string =>
	html.replace(/<[^>]*>?/gm, "");

export const insertId = (html: string, id: string): string =>
	html.replace(/(<[^\s>]+)/i, `$1 id="${id}"`);
