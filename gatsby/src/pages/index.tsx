import React from "react";

type IndexProps = {
	test?: string;
};

const IndexPage: React.FC<IndexProps> = (props: IndexProps) => {
	return (
		<div>
			<h1>Index page</h1>
			{props.test}
		</div>
	);
};

export default IndexPage;
