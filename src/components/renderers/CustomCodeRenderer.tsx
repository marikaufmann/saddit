import React from "react";

const CustomCodeRenderer = ({data}: any) => {
	return <pre className="rounded-md bg-gray-800 p-4 w-fit">
		<code className="text-sm text-gray-100 ">{data.code}</code>
	</pre>;
};

export default CustomCodeRenderer;
