import fetch from "node-fetch";
import moment from "moment";
import { Cache } from "gatsby";

import {
	configure,
	apiConfig,
	getAllPartialTopics,
	getFullTopicCached,
	getTopicCacheKey,
	getChangesSince,
} from "./index";

import { ApiPartialTopic } from "./types";

const { Response } = jest.requireActual("node-fetch");
jest.mock("node-fetch", () => jest.fn());
const mockedNodeFetch = fetch as jest.MockedFunction<typeof fetch>;

describe("api", () => {
	const apiBaseUrl = "https://test-base-url",
		apiKey = "abcd1234";

	beforeAll(() => {
		configure({ apiBaseUrl, apiKey });
	});

	afterEach(() => {
		mockedNodeFetch.mockReset();
	});

	describe("configure", () => {
		it("should set api config", () => {
			expect(apiConfig).toEqual({ apiBaseUrl, apiKey });
		});
	});

	describe("getAllPartialTopics", () => {
		it("should fetch JSON from topics endpoint using correct headers", async () => {
			mockedNodeFetch.mockResolvedValueOnce(new Response(JSON.stringify({})));

			await getAllPartialTopics();

			expect(mockedNodeFetch).toHaveBeenCalledTimes(1);
			expect(mockedNodeFetch).toHaveBeenCalledWith(`${apiBaseUrl}/topics`, {
				headers: {
					Accept: "application/json",
					"ocp-apim-subscription-key": apiKey,
				},
			});
		});

		it("should return object from JSON response data", async () => {
			const responseBody = [{ a: 1 }];
			mockedNodeFetch.mockResolvedValueOnce(
				new Response(JSON.stringify(responseBody))
			);

			expect(await getAllPartialTopics()).toEqual(responseBody);
		});
	});

	describe("getFullTopicCached", () => {
		const partialTopic = {
			id: "cd23e299-05f9-40ca-a8dc-b11a396f5c0b",
			name: "Test topic",
			currentVersion: 9,
			currentVersionLink: "/topic/cd23e299-05f9-40ca-a8dc-b11a396f5c0b",
		} as ApiPartialTopic;

		const cacheGet = jest.fn(),
			cacheSet = jest.fn(),
			cache = {
				get: cacheGet as Function,
				set: cacheSet as Function,
			} as Cache["cache"];

		beforeEach(() => {
			cacheGet.mockReset();
			cacheSet.mockReset();
		});

		describe("full topic not cached (raw API request)", () => {
			it("should fetch full topic from currentVersionLink", async () => {
				mockedNodeFetch.mockResolvedValueOnce(new Response(JSON.stringify({})));

				await getFullTopicCached(partialTopic, cache);

				expect(mockedNodeFetch).toHaveBeenCalledTimes(1);
				expect(mockedNodeFetch).toHaveBeenCalledWith(
					`${apiBaseUrl}${partialTopic.currentVersionLink}`,
					{
						headers: {
							Accept: "application/json",
							"ocp-apim-subscription-key": apiKey,
						},
					}
				);
			});

			it("should return full topic merged with partial topic", async () => {
				const fullTopic = { full: true };
				mockedNodeFetch.mockResolvedValueOnce(
					new Response(JSON.stringify(fullTopic))
				);

				const data = await getFullTopicCached(partialTopic, cache);
				expect(data).toEqual({ ...fullTopic, ...partialTopic });
			});

			it("should cache full topic object with unique cache key", async () => {
				mockedNodeFetch.mockResolvedValueOnce(
					new Response(JSON.stringify({ full: true }))
				);

				const fullTopic = await getFullTopicCached(partialTopic, cache);
				expect(cacheSet).toHaveBeenCalledWith(
					getTopicCacheKey(partialTopic),
					fullTopic
				);
			});
		});

		describe("full topic loaded from cache", () => {
			it("should return cached topic and not fetch", async () => {
				const cachedTopic = { a: 1 };

				cacheGet.mockResolvedValueOnce(cachedTopic);

				const fullTopic = await getFullTopicCached(partialTopic, cache);

				expect(cacheGet).toHaveBeenCalledWith(getTopicCacheKey(partialTopic));
				expect(mockedNodeFetch).not.toHaveBeenCalled();
				expect(fullTopic).toBe(cachedTopic);
			});
		});
	});

	describe("getChangesSince", () => {
		it("should get changes since start of previous month when no provided date", async () => {
			mockedNodeFetch.mockResolvedValueOnce(new Response(JSON.stringify({})));
			await getChangesSince();

			const startOfPreviousMonth = moment()
				.utc()
				.subtract(1, "months")
				.startOf("month")
				.toDate();

			expect(mockedNodeFetch).toHaveBeenCalledWith(
				`${apiBaseUrl}/changes-since/${startOfPreviousMonth.toISOString()}`,
				{
					headers: {
						Accept: "application/json",
						"ocp-apim-subscription-key": apiKey,
					},
				}
			);
			// Asserting that the time is 00 checks we're using UTC:
			expect(mockedNodeFetch.mock.calls[0][0].toString()).toMatch(
				"-01T00:00:00.000Z"
			);
		});

		it("should return data from JSON response", async () => {
			const responseJson = [{ a: 1 }];
			mockedNodeFetch.mockResolvedValueOnce(
				new Response(JSON.stringify(responseJson))
			);

			expect(await getChangesSince()).toStrictEqual(responseJson);
		});

		it("should request changes since given date", async () => {
			const responseJson = [{ a: 1 }];
			mockedNodeFetch.mockResolvedValueOnce(
				new Response(JSON.stringify(responseJson))
			);

			await getChangesSince(new Date(2020, 0, 13));

			expect(mockedNodeFetch).toHaveBeenCalledWith(
				`${apiBaseUrl}/changes-since/2020-01-13T00:00:00.000Z`,
				{
					headers: {
						Accept: "application/json",
						"ocp-apim-subscription-key": apiKey,
					},
				}
			);
		});
	});
});