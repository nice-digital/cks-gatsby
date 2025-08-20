import React, { useState, useEffect, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@nice-digital/nds-button";
import { Alert } from "@nice-digital/nds-alert";
import Cookies from "js-cookie";

import styles from "./EULABanner.module.scss";

export const COOKIE_EXPIRY = 365; // In days, i.e. cookie expires a year from when it's set
export const EULA_COOKIE_NAME = "CKS-EULA-Accepted";
export const COOKIE_CONTROL_NAME = "CookieControl";

export const EULABanner: React.FC = () => {
	const [showEULABanner, setShowEULABanner] = useState<boolean>(false);
	const titleRef = useRef<HTMLHeadingElement>(null);

	const isCookieControlSetAndDialogHidden = (): boolean => {
		const cookieControl = Cookies.get(COOKIE_CONTROL_NAME);
		const cookieControlExists = !!cookieControl;
		const cookieDialog = document.querySelector(
			"[role='region'] .ccc-module--slideout"
		);
		const cookieDialogExists = !!cookieDialog;
		return cookieControlExists && !cookieDialogExists;
	};

	const toggleBannerBasedOnEULACookie = (): void => {
		const shouldOpen = !Cookies.get(EULA_COOKIE_NAME);
		setShowEULABanner(shouldOpen);

		// Focus the title when the banner opens
		if (shouldOpen) {
			// Use setTimeout to ensure the dialog is rendered before focusing
			setTimeout(() => {
				if (titleRef.current) {
					titleRef.current.focus();
				}
			}, 100);
		}
	};

	useEffect(() => {
		const checkBanner = () => {
			if (isCookieControlSetAndDialogHidden()) {
				toggleBannerBasedOnEULACookie();
				observer.disconnect();
			}
		};

		const observer = new MutationObserver(() => {
			checkBanner();
		});

		observer.observe(document.body, { childList: true, subtree: true });

		checkBanner();

		return () => {
			observer.disconnect();
		};
	}, []);

	// Terms are accepted - dismiss modal and store cookie
	const handleAccept = () => {
		setShowEULABanner(false);
		Cookies.set(EULA_COOKIE_NAME, "true", {
			expires: COOKIE_EXPIRY,
		});
	};

	return (
		<Dialog.Root open={showEULABanner}>
			<Dialog.Portal>
				<Dialog.Overlay className={styles.overlay} />
				<Dialog.Content className={styles.portal}>
					<h2 ref={titleRef} tabIndex={-1}>
						CKS End User Licence Agreement
					</h2>
					<Alert>
						Please read all the terms on this page. Then indicate that you have
						read and agree to the terms by clicking the button at the bottom of
						the page.
					</Alert>
					<EULABannerContent />
					<Button variant="cta" onClick={handleAccept} id="btn-accept-cks-eula">
						I accept these terms
					</Button>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export const EULABannerContent: React.FC = () => (
	<section>
		<h3>1. This contract</h3>
		<ul className="list list--unstyled">
			<li>
				1.1 By Using the Topics, you agree to enter into a contract with Us on
				the terms set out below.
			</li>
			<li>
				1.2 If you wish to use CKS on behalf of your employer / company /
				organisation, you must have permission to enter into this contract on
				behalf of that organisation. Otherwise, you will be entering into this
				contract in your personal capacity.
			</li>
			<li>
				1.3 Please read these terms carefully because although CKS is freely
				available in the UK it is only available for use, free of charge, by
				limited people and in limited circumstances.
			</li>
		</ul>
		<h3>2. Who can use CKS and for what purpose?</h3>
		<ul className="list list--unstyled">
			<li>2.1 You agree that you are only allowed to Use the Topics if you:</li>
		</ul>
		<ul className="list list--unstyled">
			<li>(i) Are an individual; in which case:</li>
			<ul>
				<li>
					You are allowed to Use for personal and/or your own educational
					purposes only and not on behalf of or for the benefit of any company,
					organisation, or business.
				</li>
				<li>
					You agree not to Use the Topics for self-diagnosis and you agree not
					to rely on the Topics as a substitute for a consultation with a
					qualified clinician. You must only follow the guidance of a registered
					medical practitioner. You understand that the Topics are written for
					qualified clinicians and not patients.
				</li>
			</ul>
			<li>(ii) Are a clinician; in which case:</li>
			<ul>
				<li>
					You must be employed or engaged within the UK public sector on behalf
					of the National Health Service and using the Topics solely for the
					benefit of the National Health Service and patients.
				</li>
				<li>
					You understand that the guidance contained within the Topics is not a
					substitute for you exercising your own professional judgment.
					Furthermore, you recognise that the Topics are one of a range of
					information sources that may inform your judgment and you should not
					place sole reliance on the Topics.
				</li>
			</ul>
			<li>
				2.2 If you are not an individual or a clinician (as defined above), you
				must contact Us for a commercial licence. If you do not, you understand
				that by Using the Topics you or your organisation will be infringing Our
				intellectual property rights.
			</li>
			<li>
				2.3 For the avoidance of doubt, the following, without limitation, are
				not permitted to Use the Topics (but may do so by contacting Agilio and
				entering into a commercial licence):
			</li>
			<ul className="list list--unstyled">
				<li>
					(i) schools, universities, and other educational establishments, or
					individuals working for the same;
				</li>
				<li>(ii) anyone outside the UK; and/or</li>
				<li>
					(iii) companies, businesses, and any other private enterprises that
					are not part of the National Health Service.
				</li>
			</ul>
		</ul>
		<h3>3. Limitations of usage rights</h3>
		<ul className="list list--unstyled">
			<li>
				3.1 You understand that your Use of the Topics is limited, as follows:
			</li>
		</ul>
		<ul className="list list--unstyled">
			<li>
				(i) You are allowed to print a reasonable number of copies of Topics in
				support of your rights of use under this contract.
			</li>
			<li>
				(ii) If you are using the Topics to assist you with your work or
				studies, you cannot copy whole Topics; you can only copy extracts from
				the Topics. If you do so, you must identify Us as the author.
			</li>
			<li>
				(iii) In no circumstances are you allowed to Use the Topics directly or
				indirectly for commercial gain, benefit, and/or exploitation by or for
				anyone or any enterprise outside of the National Health Service.
			</li>
			<li>
				(iv) You are not allowed to distribute or resell the Topics (or any part
				of them), save that if you are a clinician you are allowed to distribute
				Topics (or any part of them) to patients or colleagues to the extent
				necessary to enable you to do your job.
			</li>
			<li>
				(v) You cannot Use the Topics to create other material, such as books,
				articles, or guidance. This does not prevent you from referring to
				appropriately referenced extracts of Topics. It does however prevent you
				from creating other materials (such as knowledge or guidance for doctors
				or patients) that is based on, or informed by, the Topics.
			</li>
			<li>3.2 Any rights not set out above are reserved by Us.</li>
			<li>
				3.3 All rights granted in this contract are subject to all limitations
				set out in this contract.
			</li>
		</ul>
		<h3>4. Liability</h3>
		<ul className="list list--unstyled">
			<li>
				4.1 Nothing in this contract affects your statutory rights, nor does it
				limit Our liability for death or personal injury caused by Our
				negligence. Otherwise however, in consideration of Us giving you
				permission to Use the Topics for no charge, you agree that Our liability
				arising under or in connection with this contract is limited to £1. We
				are willing to accept a higher level of liability if you enter into a
				commercial contract with us.
			</li>
		</ul>
		<h3>5. Ending the contract</h3>
		<ul className="list list--unstyled">
			<li>
				5.1 This contract may be terminated by Us at any time if we reasonably
				consider you may have broken the terms. If the contract is terminated,
				your right to Use the Topics terminates.
			</li>
		</ul>
		<h3>6. Law</h3>
		<ul className="list list--unstyled">
			<li>
				6.1 This contract is subject to English law and the exclusive
				jurisdiction of the English courts.
			</li>
		</ul>
		<h3>7. Defined terms</h3>
		<ul className="list list--unstyled">
			<li>
				7.1 Finally, certain terms in this contract have special meanings:
			</li>
			<ul className="list list--unstyled">
				<li>
					(i) “Topics” means the CKS topics and content made available by NICE{" "}
					<a href="https://cks.nice.org.uk/">from the CKS website</a>.
				</li>
				<li>
					(ii) “Us” (including “We” or “Our”) means Clarity Informatics Limited
					(trading as “Agilio”) a company incorporated under the laws of England
					with company number 04133376 of Deltic House, Kingfisher Way,
					Wallsend, NE28 9NX. Clarity Informatics Limited (trading as “Agilio”)
					can be contacted using the contact details on the webpage:{" "}
					<a href="https://agiliosoftware.com/prodigy">
						https://agiliosoftware.com/prodigy
					</a>
					.
				</li>
				<li>(iii) “Use” (or “Using”) means use and/or access.</li>
				<li>
					(iv) “UK” means the United Kingdom, the British Overseas Territories,
					and the Crown Dependencies.
				</li>
			</ul>
		</ul>
	</section>
);
