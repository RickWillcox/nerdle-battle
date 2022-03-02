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
import { getNextAvailableTileIndex, getLastTileChangedIndex, getGuessColours } from './Tilefunctions';
import { getPlayerIndexFromUserId } from './PlayerFunctions';
import { isEquationValid, makeEquationFromGuessRow } from './MathFunctions';

type InternalState = GameState;

const DEFAULT_ROW: GuessRow = [
    { state: TileState.NOT_ACTIVE, char: '' },
    { state: TileState.NOT_ACTIVE, char: '' },
    { state: TileState.NOT_ACTIVE, char: '' },
    { state: TileState.NOT_ACTIVE, char: '' },
    { state: TileState.NOT_ACTIVE, char: '' },
    { state: TileState.NOT_ACTIVE, char: '' },
    { state: TileState.NOT_ACTIVE, char: '' },
    { state: TileState.NOT_ACTIVE, char: '' },
];
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
            gameBoard: [Array.from(DEFAULT_ROW)],
        });
        return Response.ok();
    }
    startGame(state: InternalState, userId: UserId, ctx: Context, request: IStartGameRequest): Response {
        state.nerdleAnswer = ctx.chance.pickone(FinalAnswers);
        state.gameStatus = GameStatus.RUNNING;
        return Response.ok();
    }
    fillTile(state: InternalState, userId: UserId, ctx: Context, request: IFillTileRequest): Response {
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
    makeGuess(state: InternalState, userId: UserId, ctx: Context, request: IMakeGuessRequest): Response {
        let playerIndex = getPlayerIndexFromUserId(state.players, userId);
        let playerBoard = state.players[playerIndex].gameBoard;
        let guessRowIndex: number = playerBoard.length - 1;
        makeEquationFromGuessRow;
        let guessEquation: string = makeEquationFromGuessRow(playerBoard[guessRowIndex]);

        let equationValid = isEquationValid(guessEquation);

        if (!equationValid) return Response.error('Equation is not valid');

        // update colours based on what what correct/ wrong or wrong position
        if (state.nerdleAnswer === undefined) return Response.error('Answer not found. Server Error');
        let guessColours = getGuessColours(playerBoard[guessRowIndex], state.nerdleAnswer);
        for (let i = 0; i < guessColours.length; i++) {
            let tS: TileState;
            if (guessColours[i] === 'G') {
                tS = TileState.CORRECT;
            } else if (guessColours[i] === 'Y') {
                tS = TileState.WRONG_TILE;
            } else {
                tS = TileState.WRONG;
            }
            playerBoard[guessRowIndex][i].state = tS;
        }

        if (guessEquation !== state.nerdleAnswer) {
            return Response.error('Equation is not the answer');
        }

        // Made it this far its the correct answer
        console.log('correct answer');

        // push a new guess row
        // playerBoard.push(Array.from(DEFAULT_ROW));

        return Response.ok();
    }
    deleteLastTile(state: InternalState, userId: UserId, ctx: Context, request: IDeleteLastTileRequest): Response {
        let playerIndex = getPlayerIndexFromUserId(state.players, userId);
        let playerBoard = state.players[playerIndex].gameBoard;
        let lastTileIndex = getLastTileChangedIndex(Array.from(playerBoard));
        let guessRowIndex: number = playerBoard.length - 1;

        if (lastTileIndex <= -1) return Response.error('Nothing to Delete');

        playerBoard[guessRowIndex][lastTileIndex].char = '';
        playerBoard[guessRowIndex][lastTileIndex].state = TileState.NOT_ACTIVE;
        return Response.ok();
    }
    getUserState(state: InternalState, userId: UserId): GameState {
        let nAnswer = state.nerdleAnswer;
        if (state.gameStatus === GameStatus.RUNNING || state.gameStatus === GameStatus.NOT_STARTED) {
            nAnswer = undefined;
        }
        return {
            players: state.players,
            gameStatus: state.gameStatus,
            timeLeft: state.timeLeft,
            nerdleAnswer: nAnswer,
        };
    }
}
