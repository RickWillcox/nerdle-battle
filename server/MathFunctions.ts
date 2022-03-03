import { GuessRow } from '../api/types';

export function isEquationValid(equation: string): boolean {
    if (equation.length < 8) {
        return false;
    }
    return eval(equation.replace('=', '=='));
}

export function makeEquationFromGuessRow(guessRow: GuessRow): string {
    let equation: string = '';
    guessRow.forEach((dic) => (equation += dic.char));
    return equation;
}

export function gameTimeLeft(startTime: number, currentTime: number, gameTime: number): number {
    let timeDiff = currentTime - startTime;
    timeDiff /= 1000;
    let secondsRunning = Math.round(timeDiff % 60);
    return gameTime - secondsRunning;
}
