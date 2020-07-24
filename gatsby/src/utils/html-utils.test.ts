import { stripHtmlComments, stripHtmlTags, insertId } from "./html-utils";

describe("html-utils", () => {
	describe("stripHtmlComments", () => {
		it("should strip empty comments from string", () => {
			expect(stripHtmlComments("<!----><p>Something</p>")).toBe(
				"<p>Something</p>"
			);
		});

		it("should strip comments from single line string", () => {
			expect(
				stripHtmlComments("<!-- Test1 --><p>Something</p><!-- Test2 -->")
			).toBe("<p>Something</p>");
		});

		it("should strip comments from a multiline string", () => {
			expect(
				stripHtmlComments(`<!-- Test
					1 --><p>Something</p><!-- Test
					2 -->`)
			).toBe("<p>Something</p>");
		});
	});
	describe("stripHtmlTags", () => {
		it("should strip single tag", () => {
			expect(stripHtmlTags("<p>Something</p>")).toBe("Something");
		});

		it("should strip single tag with attributes", () => {
			expect(stripHtmlTags('<p class="test">Something</p>')).toBe("Something");
		});

		it("should strip nested tags", () => {
			expect(stripHtmlTags('<p class="test"><span>Something</span></p>')).toBe(
				"Something"
			);
		});

		it("should strip nested tags with attributes", () => {
			expect(
				stripHtmlTags(
					'<p class="test"><span class="aclass">Something</span>here</p>'
				)
			).toBe("Somethinghere");
		});

		it("should strip HTML comments", () => {
			expect(
				stripHtmlTags('<p class="test"><!-- Comment -->Something</p>')
			).toBe("Something");
		});
	});

	describe("insertId", () => {
		it("should insert id into simple tag", () => {
			expect(insertId("<h2>Test</h2>", "test")).toBe(`<h2 id="test">Test</h2>`);
		});

		it("should insert id into tag with existing attributes", () => {
			expect(insertId(`<h2 class="abc">Test</h2>`, "test")).toBe(
				`<h2 id="test" class="abc">Test</h2>`
			);
		});

		it("should only insert id into first tag", () => {
			expect(
				insertId(`<h2><span>Test</span></h2><p>Something</p>`, "test")
			).toBe(`<h2 id="test"><span>Test</span></h2><p>Something</p>`);
		});
	});
});
