import { onClientEntry } from "../gatsby-browser";
import { ReportHandler, Metric } from "web-vitals";

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
});
