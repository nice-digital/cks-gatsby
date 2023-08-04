import React from "react";

import { Panel } from "@nice-digital/nds-panel";

export const HelpPanel: React.FC = () => (
	<Panel>
		<h2 className="h3">Help develop CKS</h2>
		<p>
			CKS topics rely on feedback from healthcare professionals, patients
			groups, patients and carers to ensure they are accurate and relevant.
		</p>
		<ul aria-label="How to help develop CKS">
			<li>
				<a href="https://agiliosoftware.com/primary-care/prodigy/">
					Help develop CKS topics
				</a>
			</li>
			<li>
				<a href="https://www.nice.org.uk/cks-feedback">
					Send feedback on CKS topics
				</a>
			</li>
		</ul>
	</Panel>
);
