"use client";
import React, { useState, useEffect } from "react";
import LetterBox from "./Letter";
import { words } from "../data/words";

const Wordle = () => {
	const [guesses, setGuesses] = useState(Array(6).fill(""));
	const [currentGuess, setCurrentGuess] = useState("");
	const [correctWord, setCorrectWord] = useState("");
	const [showPopup, setShowPopup] = useState(false);
	const [hintIndex, setHintIndex] = useState(0);
	const [gameOver, setGameOver] = useState(false);
	const [theme, setTheme] = useState("dark");
	const [score, setScore] = useState({ wins: 0, losses: 0 });

	useEffect(() => {
		const randomWord = words[Math.floor(Math.random() * words.length)];
		setCorrectWord(randomWord);
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!gameOver && e.target.value.length <= 5) {
			setCurrentGuess(e.target.value.toUpperCase());
		}
	};

	const handleSubmit = () => {
		if (gameOver) return;

		if (currentGuess.length === 5) {
			const newGuesses = [...guesses];
			const firstEmptyIndex = newGuesses.findIndex((guess) => guess === "");

			if (firstEmptyIndex !== -1) {
				newGuesses[firstEmptyIndex] = currentGuess;
				setGuesses(newGuesses);
				setCurrentGuess("");

				if (currentGuess === correctWord) {
					setTimeout(() => {
						setScore((prevScore) => ({
							...prevScore,
							wins: prevScore.wins + 1,
						}));
						setShowPopup(true);
						setGameOver(true);
					}, 500);
				} else if (firstEmptyIndex === guesses.length - 1) {
					setTimeout(() => {
						setScore((prevScore) => ({
							...prevScore,
							losses: prevScore.losses + 1,
						}));
						setShowPopup(true);
						setGameOver(true);
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
		if (gameOver) return;

		while (
			hintIndex < correctWord.length &&
			currentGuess.includes(correctWord[hintIndex])
		) {
			setHintIndex((prev) => prev + 1);
		}
		if (hintIndex < correctWord.length) {
			setCurrentGuess(
				(prev) =>
					prev.substring(0, hintIndex) +
					correctWord[hintIndex] +
					prev.substring(hintIndex + 1)
			);
			setHintIndex((prev) => prev + 1);
		}
	};

	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
	};

	const refreshGame = () => {
		setGuesses(Array(6).fill(""));
		setCurrentGuess("");
		setGameOver(false);
		setHintIndex(0);
		setShowPopup(false);

		const randomWord = words[Math.floor(Math.random() * words.length)];
		setCorrectWord(randomWord);
	};

	return (
		<div
			className={`min-h-screen min-w-full flex flex-col items-center justify-center ${
				theme === "dark"
					? "bg-neutral-900 text-white"
					: "bg-neutral-100 text-black"
			}`}
		>
			{/* Menu */}
			<div className="flex justify-between w-full px-4 py-2 bg-neutral-800 absolute top-0">
				<button
					onClick={toggleTheme}
					className="bg-neutral-700 text-white px-4 py-2"
				>
					{theme === "dark" ? "Light Mode" : "Dark Mode"}
				</button>
				<button
					onClick={refreshGame}
					className="bg-neutral-700 text-white px-4 py-2"
				>
					Refresh
				</button>
				<div className="text-white">
					Wins: {score.wins} | Losses: {score.losses}
				</div>
			</div>

			<div className="flex flex-col gap-1 shadow-lg mt-4">
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
					className={`px-4 py-2 text-center w-fit text-xl uppercase ${
						theme === "dark"
							? "text-neutral-100 bg-neutral-800"
							: "text-black bg-neutral-300"
					} outline-none ring-none`}
					maxLength={5}
					placeholder="Guess"
					disabled={gameOver}
				/>
				<button
					onClick={handleSubmit}
					className={`ml-2 ${
						theme === "dark" ? "bg-neutral-700" : "bg-neutral-600"
					} text-white px-4 py-[10px]`}
					disabled={gameOver}
				>
					Submit
				</button>
				<button
					onClick={handleHint}
					className={`ml-2 ${
						theme === "dark" ? "bg-neutral-700" : "bg-neutral-600"
					} text-white px-4 py-[10px]`}
					disabled={gameOver}
				>
					Hint
				</button>
			</div>

			{showPopup && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div
						className={`${
							theme === "dark" ? "bg-neutral-800" : "bg-neutral-300"
						} p-4 rounded shadow-[1rem] w-[40vw] px-8 py-8`}
					>
						<h2 className="text-xl font-bold">
							{currentGuess === correctWord ? "Congratulations!" : "Game Over"}
						</h2>
						<p>
							{currentGuess === correctWord
								? "You guessed the word correctly!"
								: `You ran out of guesses! The word was "${correctWord}".`}
						</p>
						<button
							className={`mt-4 ${
								theme === "dark" ? "bg-neutral-700" : "bg-neutral-600"
							} text-white px-4 py-2 w-full`}
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
