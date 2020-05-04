import { createSchemaCustomization } from "./../gatsby-node";
import { CreateSchemaCustomizationArgs } from "gatsby";

describe("gatsby-node", () => {
	describe("createSchemaCustomization", () => {
		it("should call createTypes with custom schema", () => {
			const createTypes = jest.fn();

			const args: unknown = {
				actions: { createTypes },
			};

			createSchemaCustomization(args as CreateSchemaCustomizationArgs);

			expect(createTypes).toHaveBeenCalledTimes(1);

			expect(createTypes.mock.calls[0][0]).toMatchSnapshot();
		});
	});
});
