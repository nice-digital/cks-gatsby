import React, { Children, isValidElement, cloneElement } from "react";
import { Link } from "gatsby";

import styles from "./Alphabet.module.scss";

export interface AlphabetProps {
	id?: string;
	children: React.ReactElement<LetterProps>[];
	chunky?: boolean;
	[key: string]: unknown;
}

export const Alphabet: React.FC<AlphabetProps> = ({
	id,
	children,
	chunky,
	...attrs
}: AlphabetProps) => (
	<ol
		className={`${styles.alphabet} ${chunky ? styles.chunkyAlphabet : ""}`}
		id={id || "a-to-z"}
		{...attrs}
	>
		{chunky
			? Children.map(children, child =>
					isValidElement(child) ? cloneElement(child, { chunky: true }) : child
			  )
			: children}
	</ol>
);

export interface LetterProps {
	children: React.ReactNode;
	label?: string;
	chunky?: boolean;
	to?: string | false;
}

export const Letter: React.FC<LetterProps> = ({
	children,
	label,
	to,
	chunky,
}: LetterProps) => {
	let body: React.ReactNode;

	if (!to) {
		body = <span aria-label={label}>{children}</span>;
	} else if (to[0] === "#") {
		body = (
			<a href={to} aria-label={label}>
				{children}
			</a>
		);
	} else {
		body = (
			<Link to={to} aria-label={label}>
				{children}
			</Link>
		);
	}

	return (
		<li className={`${styles.letter} ${chunky ? styles.chunkyLetter : ""}`}>
			{body}
		</li>
	);
};
