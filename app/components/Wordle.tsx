"use client";
import React, { useState } from "react";
import LetterBox from "./Letter";

const Wordle = () => {
	const [guesses, setGuesses] = useState(Array(6).fill(""));
	const [currentGuess, setCurrentGuess] = useState("");
	const [correctWord] = useState("CRANE");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value.length <= 5) {
			setCurrentGuess(e.target.value.toUpperCase());
		}
	};

	const handleSubmit = () => {
		if (currentGuess.length === 5) {
			const newGuesses = [...guesses];
			const firstEmptyIndex = newGuesses.findIndex((guess) => guess === "");
			if (firstEmptyIndex !== -1) {
				newGuesses[firstEmptyIndex] = currentGuess;
				setGuesses(newGuesses);
				setCurrentGuess("");
			}
		}
	};

	const getLetterStatus = (letter: string, index: number) => {
		if (correctWord[index] === letter) return "correct";
		else if (correctWord.includes(letter)) return "middle";
		else return "wrong";
	};

	return (
		<div className="min-h-screen min-w-full bg-neutral-900 flex flex-col items-center justify-center">
			<div className="flex flex-col gap-1 shadow-lg">
				{guesses.map((guess, rowIndex) => (
					<div key={rowIndex} className="flex gap-1">
						{Array.from({ length: 5 }).map((_, colIndex) => (
							<LetterBox
								key={colIndex}
								letter={guess[colIndex] || ""}
								status={
									guess ? getLetterStatus(guess[colIndex], colIndex) : "wrong"
								}
							/>
						))}
					</div>
				))}
			</div>
			<div className="mt-4 flex items-center justify-center">
				<input
					type="text"
					value={currentGuess}
					onChange={handleChange}
					className="px-4 py-2 text-cente w-fit text-xl uppercase text-neutral-100 bg-neutral-800 outline-none ring-none"
					maxLength={5}
					placeholder="Guess"
				/>
				<button
					onClick={handleSubmit}
					className="ml-2 bg-neutral-700 text-white px-4 py-[10px]"
				>
					Submit
				</button>
			</div>
		</div>
	);
};

export default Wordle;
