export const stripHtmlComments = (html: string): string =>
	html.replace(/<!--[\s\S]*?(?:-->)/g, "");

export const stripHtmlTags = (html: string): string =>
	html.replace(/<[^>]*>?/gm, "");
