// Let TypeScript know we're importing SCSS (and SCSS modules)
// Avoids "Can't import CSS/SCSS modules. TypeScript says “Cannot Find Module”"
// See https://stackoverflow.com/a/41946697/486434
declare module "*.scss" {
	const content: { [className: string]: string };
	export default content;
}
