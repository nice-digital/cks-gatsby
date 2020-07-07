import React from "react";
import GlobalNavFooter from "./GlobalNavFooter";

export const Footer: React.FC = () => (
	<>
		{typeof window !== "undefined" && (
			<React.Suspense fallback={<></>}>
				<GlobalNavFooter service="cks" />
			</React.Suspense>
		)}
	</>
);
