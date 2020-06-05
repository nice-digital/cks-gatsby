import {
	SourceNodesArgs,
	ActivityTracker,
	ProgressActivityTracker,
} from "gatsby";

import { downloadAllData } from "./downloader";

import {
	getAllPartialTopics,
	getFullTopicCached,
	getChangesSince,
} from "../api/api";
import {
	ApiTopicsResponse,
	ApiPartialTopic,
	ApiFullTopic,
	ApiTopicChangeResponse,
} from "../api/types";

jest.mock("./../api/api", () => ({
	getAllPartialTopics: jest.fn().mockResolvedValue({
		topics: [],
	}),
	getChangesSince: jest.fn(),
	getFullTopicCached: jest.fn(),
}));

// Typed API mocks for convenience
const apiMocks = {
	getAllPartialTopics: getAllPartialTopics as jest.Mock<
		Promise<ApiTopicsResponse>
	>,
	getChangesSince: (getChangesSince as jest.Mock<
		Promise<ApiTopicChangeResponse>
	>).mockResolvedValue([]),
	getFullTopicCached: getFullTopicCached as jest.Mock<Promise<ApiFullTopic>>,
};

const cache = { set: jest.fn(), get: jest.fn() };

const sourceNodesArgs: SourceNodesArgs = ({
	cache,
	reporter: {
		createProgress: (): ProgressActivityTracker =>
			({
				tick: jest.fn() as Function,
				done: jest.fn() as Function,
				start: jest.fn() as Function,
			} as ProgressActivityTracker),
		activityTimer: (): ActivityTracker =>
			({
				start: jest.fn() as Function,
				setStatus: jest.fn() as Function,
				end: jest.fn() as Function,
			} as ActivityTracker),
		info: jest.fn(),
	},
} as unknown) as SourceNodesArgs;

const testPartialTopic = {
	id: "123",
	currentVersionLink: "/topics/bloaty-head",
} as ApiPartialTopic;

const testFullTopic = {
	topicId: "123",
	topicName: "Bloaty head",
} as ApiFullTopic;

describe("downloader", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("downloadAllData", () => {
		it("should download full topic index", async () => {
			await downloadAllData(sourceNodesArgs, new Date());
			expect(getAllPartialTopics).toHaveBeenCalledTimes(1);
			expect(getAllPartialTopics).toHaveBeenCalledWith();
		});

		it("should download and return all full topics in topic index", async () => {
			apiMocks.getAllPartialTopics.mockResolvedValue({
				topics: [testPartialTopic],
			} as ApiTopicsResponse);

			apiMocks.getFullTopicCached.mockResolvedValue(testFullTopic);

			const { fullTopics } = await downloadAllData(sourceNodesArgs, new Date());

			expect(getFullTopicCached).toHaveBeenCalledTimes(1);
			expect(getFullTopicCached).toHaveBeenCalledWith(testPartialTopic, cache);
			expect(fullTopics).toEqual([testFullTopic]);
		});

		it("should download and return all monthly changes", async () => {
			const mockChange = {
				topicId: testPartialTopic.id,
				topicName: testPartialTopic.name,
				title: "New topic",
				text: "Lorem ipsum",
			};

			const date = new Date(2020, 0, 12);

			apiMocks.getChangesSince.mockResolvedValue([mockChange]);

			const { changes } = await downloadAllData(sourceNodesArgs, date);

			expect(getChangesSince).toHaveBeenCalledTimes(1);
			expect(getChangesSince).toHaveBeenCalledWith(date);
			expect(changes).toEqual([mockChange]);
		});
	});
});
