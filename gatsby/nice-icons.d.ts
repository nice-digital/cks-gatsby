// nice-icons doesn't come with typescript defs
// for the react components
declare module "@nice-digital/icons/lib/print" {
	import { FC } from "react";

	export interface IconProps {
		colour?: string;
		[key: string]: unknown;
	}

	const PrintIcon: FC<IconProps>;

	export default PrintIcon;
}
