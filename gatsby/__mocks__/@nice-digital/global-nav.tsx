import React, { type PropsWithChildren } from "react";

// Actual header required because the SiteHeader component is mocked globally (see jest.setup.ts)
export const Header = jest.requireActual("@nice-digital/global-nav").Header;

// Mocked footer as null to avoid noise in tests
export const Footer = jest.fn().mockReturnValue(null);

// Mock a simpler version of main (without back to top) to avoid noise in tests and snapshots
export const Main = jest.fn(({ children }: PropsWithChildren<unknown>) => (
	<main>{children}</main>
));
