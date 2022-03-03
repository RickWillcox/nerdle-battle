import { Methods, Context } from './.hathora/methods';
import { Response } from '../api/base';
import {
    GameStatus,
    TileState,
    Tile,
    BoardState,
    GuessRow,
    Player,
    GameState,
    UserId,
    IJoinGameRequest,
    IStartGameRequest,
    IFillTileRequest,
    IMakeGuessRequest,
    IDeleteLastTileRequest,
} from '../api/types';
import { FinalAnswers } from './FinalAnswers';
import { ValidInputs } from './ValidInputs';
import {
    getNextAvailableTileIndex,
    getLastTileChangedIndex,
    getGuessColours,
    getNewGuessRow,
    getNewInputBoard,
    updateInputBoard,
} from './Tilefunctions';
import { getPlayerIndexFromUserId, removeDataForOtherPlayers } from './PlayerFunctions';
import { isEquationValid, makeEquationFromGuessRow, gameTimeLeft } from './MathFunctions';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Stopwatch = require('stopwatch').Stopwatch;

const GAME_TIMER: number = 15;
var startTime: number;

type InternalState = GameState;

export class Impl implements Methods<InternalState> {
    initialize(userId: UserId, ctx: Context): InternalState {
        return {
            players: [],
            gameStatus: GameStatus.NOT_STARTED,
            timeLeft: 60,
        };
    }
    joinGame(state: InternalState, userId: UserId, ctx: Context, request: IJoinGameRequest): Response {
        state.players.push({
            id: userId,
            gameBoard: [getNewGuessRow()],
            inputBoard: getNewInputBoard(),
        });
        return Response.ok();
    }
    startGame(state: InternalState, userId: UserId, ctx: Context, request: IStartGameRequest): Response {
        state.nerdleAnswer = ctx.chance.pickone(FinalAnswers);
        state.gameStatus = GameStatus.RUNNING;
        console.log(state.nerdleAnswer);
        startTime = Date.now();
        return Response.ok();
    }
    fillTile(state: InternalState, userId: UserId, ctx: Context, request: IFillTileRequest): Response {
        if (state.gameStatus === GameStatus.RUNNING) {
            if (!ValidInputs.includes(request.input)) return Response.error(`Invalid Input ${request.input}`);

            let playerIndex = getPlayerIndexFromUserId(state.players, userId);
            let playerBoard = state.players[playerIndex].gameBoard;
            let tileIndex = getNextAvailableTileIndex(Array.from(playerBoard));
            let guessRowIndex: number = playerBoard.length - 1;

            if (tileIndex === -1) return Response.error('No Tiles to fill');

            playerBoard[guessRowIndex][tileIndex].char = request.input;
            playerBoard[guessRowIndex][tileIndex].state = TileState.ACTIVE;

            return Response.ok();
        }
        return Response.error('Game is not running');
    }
    makeGuess(state: InternalState, userId: UserId, ctx: Context, request: IMakeGuessRequest): Response {
        if (state.gameStatus === GameStatus.RUNNING) {
            let playerIndex = getPlayerIndexFromUserId(state.players, userId);
            let playerBoard = state.players[playerIndex].gameBoard;
            let playerInputBoard = state.players[playerIndex].inputBoard;
            let guessRowIndex: number = playerBoard.length - 1;
            makeEquationFromGuessRow;
            let guessEquation: string = makeEquationFromGuessRow(playerBoard[guessRowIndex]);

            let equationValid = isEquationValid(guessEquation);

            if (!equationValid) return Response.error('Equation is not valid');

            // update colours based on what what correct/ wrong or wrong position
            if (state.nerdleAnswer === undefined) return Response.error('Answer not found. Server Error');
            let guessColours = getGuessColours(playerBoard[guessRowIndex], state.nerdleAnswer);
            for (let i = 0; i < guessColours[0].length; i++) {
                let tS: TileState;
                let iS: TileState;
                let guessChar = guessColours[1][i];

                if (guessColours[0][i] === 'G') {
                    tS = TileState.CORRECT;
                    updateInputBoard(playerInputBoard, guessChar, 'G');
                } else if (guessColours[0][i] === 'Y') {
                    tS = TileState.WRONG_TILE;
                    updateInputBoard(playerInputBoard, guessChar, 'Y');
                } else {
                    tS = TileState.WRONG;
                    updateInputBoard(playerInputBoard, guessChar, 'B');
                }
                playerBoard[guessRowIndex][i].state = tS;
            }

            console.log('Nerdle Answer: ', state.nerdleAnswer);
            console.log('Player guess: ', guessEquation);

            // Wrong answer
            if (guessEquation !== state.nerdleAnswer) {
                if (playerBoard.length < 6) {
                    // push a new guess row
                    playerBoard.push(getNewGuessRow());
                    return Response.error('Equation is not the answer');
                }
                return Response.error('Game Over, You have use all your guesses');
            }

            // Made it this far its the correct answer
            console.log('correct answer');
            state.winner = userId;
            state.gameStatus = GameStatus.ENDED;
            return Response.ok();
        }
        return Response.error('Game is not running');
    }
    deleteLastTile(state: InternalState, userId: UserId, ctx: Context, request: IDeleteLastTileRequest): Response {
        if (state.gameStatus === GameStatus.RUNNING) {
            let playerIndex = getPlayerIndexFromUserId(state.players, userId);
            let playerBoard = state.players[playerIndex].gameBoard;
            let lastTileIndex = getLastTileChangedIndex(Array.from(playerBoard));
            let guessRowIndex: number = playerBoard.length - 1;

            if (lastTileIndex <= -1) return Response.error('Nothing to Delete');

            playerBoard[guessRowIndex][lastTileIndex].char = '';
            playerBoard[guessRowIndex][lastTileIndex].state = TileState.NOT_ACTIVE;
            return Response.ok();
        }
        return Response.error('Game is not running');
    }
    getUserState(state: InternalState, userId: UserId): GameState {
        let nAnswer = state.nerdleAnswer;
        if (state.gameStatus === GameStatus.RUNNING || state.gameStatus === GameStatus.NOT_STARTED) {
            nAnswer = undefined;
        }
        let secondsLeft: number = gameTimeLeft(startTime, Date.now(), GAME_TIMER);
        let playersArray: Player[] = removeDataForOtherPlayers(Array.from(state.players), userId);
        return {
            players: playersArray,
            gameStatus: state.gameStatus,
            timeLeft: secondsLeft,
            nerdleAnswer: nAnswer,
        };
    }
}
