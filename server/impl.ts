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
import { getNextAvailableTileIndex, getLastTileChangedIndex } from './Tilefunctions';

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
        return Response.error('Not implemented');
    }
    fillTile(state: InternalState, userId: UserId, ctx: Context, request: IFillTileRequest): Response {
        if (!ValidInputs.includes(request.input)) return Response.error(`Invalid Input ${request.input}`);

        let playerIndex = state.players.findIndex((player) => player['id'] === userId);
        let playerBoard = state.players[playerIndex].gameBoard;

        let tileIndex = getNextAvailableTileIndex(Array.from(playerBoard));
        if (tileIndex === -1) return Response.error('No Tiles to fill');

        let GuessRowIndex: number = playerBoard.length - 1;

        playerBoard[GuessRowIndex][tileIndex].char = request.input;

        return Response.ok();
    }
    makeGuess(state: InternalState, userId: UserId, ctx: Context, request: IMakeGuessRequest): Response {
        return Response.error('Not implemented');
    }
    deleteLastTile(state: InternalState, userId: UserId, ctx: Context, request: IDeleteLastTileRequest): Response {
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
