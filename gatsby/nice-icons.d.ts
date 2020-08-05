// nice-icons doesn't come with typescript defs
// for the react components
declare module "@nice-digital/icons/lib/ChevronDown" {
	import { FC } from "react";

	export interface IconProps {
		colour?: string;
		[key: string]: unknown;
	}

	const ChevronDownIcon: FC<IconProps>;

	export default ChevronDownIcon;
}

declare module "@nice-digital/icons/lib/ChevronUp" {
	import { FC } from "react";

	export interface IconProps {
		colour?: string;
		[key: string]: unknown;
	}

	const ChevronUpIcon: FC<IconProps>;

	export default ChevronUpIcon;
}
