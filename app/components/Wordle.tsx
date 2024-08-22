"use client";
import React, { useState, useEffect } from "react";
import LetterBox from "./Letter";
import { words } from "../data/words";

const Wordle = () => {
	const [guesses, setGuesses] = useState(Array(6).fill(""));
	const [currentGuess, setCurrentGuess] = useState("");
	const [correctWord, setCorrectWord] = useState("");
	const [showPopup, setShowPopup] = useState(false);
	const [hintIndex, setHintIndex] = useState(0); // Tracks which letter to reveal next

	useEffect(() => {
		const randomWord = words[Math.floor(Math.random() * words.length)];
		setCorrectWord(randomWord);
	}, []);

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

				if (currentGuess === correctWord) {
					setTimeout(() => {
						setShowPopup(true);
					}, 500);
				}
			}
		}
	};

	const getLetterStatus = (letter: string, index: number) => {
		if (correctWord[index] === letter) return "correct";
		else if (correctWord.includes(letter)) return "middle";
		else return "wrong";
	};

	const handleHint = () => {
		while (
			hintIndex < correctWord.length &&
			currentGuess.includes(correctWord[hintIndex])
		) {
			setHintIndex(hintIndex + 1); // Skip letters already guessed correctly
		}
		if (hintIndex < correctWord.length) {
			setCurrentGuess(
				(prev) =>
					prev.substring(0, hintIndex) +
					correctWord[hintIndex] +
					prev.substring(hintIndex + 1)
			);
			setHintIndex(hintIndex + 1);
		}
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
				<button
					onClick={handleHint}
					className="ml-2 bg-neutral-700 text-white px-4 py-[10px]"
				>
					Hint
				</button>
			</div>

			{showPopup && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-neutral-800 p-4 rounded shadow-[1rem] w-[40vw] px-8 py-8">
						<h2 className="text-xl font-bold">Congratulations!</h2>
						<p>You guessed the word correctly!</p>
						<button
							className="mt-4 bg-neutral-700 text-white px-4 py-2 w-full"
							onClick={() => setShowPopup(false)}
						>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Wordle;
