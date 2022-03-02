import { BoardState, GuessRow } from '../api/types';
import { makeEquationFromGuessRow } from './MathFunctions';

export function getNextAvailableTileIndex(boardState: BoardState): number {
    let currentGuessRow: GuessRow = boardState[boardState.length - 1];
    let indexOfNextAvailableTile = currentGuessRow.findIndex((tile) => tile.char === '');
    // returns index or -1 if not found
    return indexOfNextAvailableTile;
}

export function getLastTileChangedIndex(boardState: BoardState) {
    let currentGuessRow: GuessRow = boardState[boardState.length - 1];
    let indexOfLastTileChanged = currentGuessRow.findIndex((tile) => tile.char === '') - 1;
    if (indexOfLastTileChanged === -2) {
        indexOfLastTileChanged = 7;
    }
    // returns index or -1 if no entries in guessrow yet
    return indexOfLastTileChanged;
}

export function getGuessColours(guessRow: GuessRow, nerdleAnswer: string): string[] {
    let guess = makeEquationFromGuessRow(guessRow);
    let answer = nerdleAnswer;
    // Correct
    for (let i = 0; i < guess.length; i++) {
        if (guess[i] === answer[i]) {
            guess = guess.replace(guess[i], 'G');
            answer = answer.replace(answer[i], 'G');
        }
    }

    // Wrong position
    for (let i = 0; i < guess.length; i++) {
        if (guess[i] === 'G' || guess[i] === 'Y' || guess[i] === 'B') continue;
        if (answer.includes(guess[i])) {
            answer = answer.replace(guess[i], 'Y');
            guess = guess.replace(guess[i], 'Y');
        } else {
            answer = answer.replace(guess[i], 'B');
            guess = guess.replace(guess[i], 'B');
        }
    }

    return guess.split('');
}
