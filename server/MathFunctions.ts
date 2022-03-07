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
