import React from "react";

const GlobalNavFooter = React.lazy(() => import("./GlobalNavFooter"));

export const Footer: React.FC = () => (
	<>
		{typeof window !== "undefined" && (
			<React.Suspense fallback={<></>}>
				<GlobalNavFooter service="cks" />
			</React.Suspense>
		)}
	</>
);
