import React from "react";

type LetterBoxProps = {
	letter: string;
	status: "correct" | "middle" | "wrong";
};

const LetterBox: React.FC<LetterBoxProps> = ({ letter, status }) => {
	let bgColor = "bg-neutral-800";

	if (status === "correct") {
		bgColor = "bg-green-500";
	} else if (status === "middle") {
		bgColor = "bg-yellow-400";
	}

	return (
		<div
			className={`${bgColor} text-white w-12 h-12 flex items-center justify-center font-bold text-xl`}
		>
			{letter}
		</div>
	);
};

export default LetterBox;
