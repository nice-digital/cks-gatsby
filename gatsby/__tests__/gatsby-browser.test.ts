import { onClientEntry, shouldUpdateScroll } from "../gatsby-browser";
import { ReportHandler, Metric } from "web-vitals";
import { type ShouldUpdateScrollArgs } from "gatsby";

jest.mock("web-vitals", () => {
	const mockReportHandler =
		(name: "CLS" | "FCP" | "FID" | "LCP" | "TTFB", delta: number) =>
		(onReport: ReportHandler): void => {
			onReport({
				name,
				delta,
				id: "abc",
			} as Metric);
		};

	return {
		getCLS: mockReportHandler("CLS", 99),
		getFCP: mockReportHandler("FCP", 88),
		getFID: mockReportHandler("FID", 77),
		getLCP: mockReportHandler("LCP", 66),
		getTTFB: mockReportHandler("TTFB", 55),
	};
});

describe("gatsby-browser", () => {
	describe("onClientEntry", () => {
		beforeEach(() => {
			window.dataLayer.length = 0;
		});

		it.each([
			["CLS", 99000],
			["FCP", 88],
			["FID", 77],
			["LCP", 66],
			["TTFB", 55],
		])("should send %s metic to the dataLayer", (name, delta) => {
			onClientEntry();

			expect(window.dataLayer).toContainEqual({
				event: "web-vitals",
				eventCategory: "Web Vitals",
				eventAction: name,
				eventLabel: "abc",
				eventValue: delta,
			});
		});
	});

	describe("shouldUpdateScroll", () => {
		it("should give focus and scroll to an element from hash when there is no previous page", () => {
			const setAttribute = jest.fn(),
				focus = jest.fn(),
				scrollIntoView = jest.fn();

			jest.spyOn(document, "querySelector").mockReturnValue({
				setAttribute,
				focus,
				scrollIntoView,
			} as unknown as Element);

			const result = shouldUpdateScroll({
				routerProps: {
					location: {
						hash: "#test",
					},
				},
				prevRouterProps: null,
			} as unknown as ShouldUpdateScrollArgs);

			expect(result).toBe(false);

			expect(setAttribute).toHaveBeenCalledWith("tabIndex", "-1");
			expect(focus).toHaveBeenCalled();
			expect(scrollIntoView).toHaveBeenCalled();
		});

		it("should return true to default to Gatsby's default behaviour when there is no previous page but the element with hash doesn't exist", () => {
			jest.spyOn(document, "querySelector").mockReturnValue(null);

			const result = shouldUpdateScroll({
				routerProps: {
					location: {
						hash: "#test",
					},
				},
				prevRouterProps: null,
			} as unknown as ShouldUpdateScrollArgs);

			expect(result).toBe(true);
		});

		it("should default to gatsby's default behaviour if there's a hash and previous location", () => {
			jest.spyOn(document, "querySelector").mockReturnValue(null);

			const result = shouldUpdateScroll({
				routerProps: {
					location: {
						hash: "#test",
					},
				},
				prevRouterProps: null,
			} as unknown as ShouldUpdateScrollArgs);

			expect(result).toBe(true);
		});

		it("should scroll window to saved scroll position", () => {
			jest.spyOn(document, "querySelector").mockReturnValue(null);

			const result = shouldUpdateScroll({
				routerProps: {
					location: {
						hash: "#test",
					},
				},
				prevRouterProps: null,
			} as unknown as ShouldUpdateScrollArgs);

			expect(result).toBe(true);
		});

		it("should scroll window element when coming from previous page", () => {
			const setAttribute = jest.fn(),
				focus = jest.fn(),
				scrollIntoView = jest.fn();

			const documentQuerySelector = jest
				.spyOn(document, "querySelector")
				.mockReturnValue({
					setAttribute,
					focus,
					scrollIntoView,
				} as unknown as Element);

			const result = shouldUpdateScroll({
				routerProps: {
					location: {
						hash: "#test",
					},
				},
				prevRouterProps: {},
				getSavedScrollPosition: () => [0, 0],
			} as unknown as ShouldUpdateScrollArgs);

			expect(documentQuerySelector).toHaveBeenCalledWith("#test");
			expect(setAttribute).toHaveBeenCalledWith("tabIndex", "-1");
			expect(focus).toHaveBeenCalled();
			expect(scrollIntoView).toHaveBeenCalled();
			expect(result).toBe(false);
		});

		it("should default to scrolling to content start element when there is no saved scroll position or hash", () => {
			const setAttribute = jest.fn(),
				focus = jest.fn(),
				scrollIntoView = jest.fn();

			const documentGetElementById = jest
				.spyOn(document, "getElementById")
				.mockReturnValue({
					setAttribute,
					focus,
					scrollIntoView,
				} as unknown as HTMLElement);

			const result = shouldUpdateScroll({
				routerProps: {
					location: {},
				},
				prevRouterProps: {},
				getSavedScrollPosition: () => null,
			} as unknown as ShouldUpdateScrollArgs);

			expect(documentGetElementById).toHaveBeenCalledWith("content-start");
			expect(setAttribute).toHaveBeenCalledWith("tabIndex", "-1");
			expect(focus).toHaveBeenCalled();
			expect(scrollIntoView).toHaveBeenCalled();
			expect(result).toBe(false);
		});
	});
});
