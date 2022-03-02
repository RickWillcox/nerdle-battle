import { Methods, Context } from "./.hathora/methods";
import { Response } from "../api/base";
import {
  TileState,
  Tile,
  GuessRow,
  Player,
  PlayerState,
  UserId,
  IStartGameRequest,
  IFillTileRequest,
  IMakeGuessRequest,
  IDeleteLastTileRequest,
  GameStatus,
  IJoinGameRequest,
  boardState,
} from "../api/types";

const boardInitState : boardState = [
[{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""}],
[{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""}],
[{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""}],
[{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""}],
[{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""}],
[{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""}],
[{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""}],
[{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""},{state: TileState.NOT_ACTIVE, char:""}]] 

type InternalState ={
  players: Player[];
  gameStatus: GameStatus;
  timeLeft: number;
};
 
type InternalPlayer = {
  id: UserId;
  gameBoard: boardState;
}

export class Impl implements Methods<InternalState> {
  initialize(userId: UserId, ctx: Context): InternalState {
    return {
      players: [],
      gameStatus: 0,
      timeLeft: 60
    };
  }
  joinGame(state: PlayerState, userId: string, ctx: Context, request: IJoinGameRequest): Response {
    let freshBoardState : boardState = JSON.parse(JSON.stringify(boardInitState)
    state.players.push({ id: userId, gameBoard: boardInitState });
    return Response.ok();
  }

  startGame(state: InternalState, userId: UserId, ctx: Context, request: IStartGameRequest): Response {
    // TODO initialise player boards
    // TODO start game countdown timer
    // TODO Select Nerdle Answer
    // TODO Alert Players game has started 
    // TODO Allow players to use the fillTile / makeGuess / deleteLastTile functions
    return Response.error("Not implemented");
  }
  fillTile(state: InternalState, userId: UserId, ctx: Context, request: IFillTileRequest): Response {
    // TODO If Char allowed and not already 8 char in row, 
    //      show the character in the first non active tile - Set tile to active and value to player input
    return Response.error("Not implemented");
  }
  makeGuess(state: InternalState, userId: UserId, ctx: Context, request: IMakeGuessRequest): Response {
    /* TODO if char = 8 and eval equation = true, check each char index 
      set to WRONG if not found in PlayerCurrentAnswer, 
      set to WRONG_TILE if found at least once but not in the right spot
      set to CORRECT if tile value matches answer value at that index
      if player guess is not correct  = 8 > send them feedback to show, recolour their tiles and move them down a row
            Show the other player the colours but not the values of the other players guess
      if player correct = 8 then end the game and declare that player the winner
      when game ends show both players values and colours for each square
       */  
    return Response.error("Not implemented");
  }
  deleteLastTile(state: InternalState, userId: UserId, ctx: Context, request: IDeleteLastTileRequest): Response {
    /* if the current row has any tiles not set to NOT_ACTIVE
          delete the last tile, by setting its value to "" and status to NOT_ACTIVE
      Do nothing if player is on the first tile of the row  
    */
    return Response.error("Not implemented");
  }
  getUserState(state: InternalState, userId: UserId): PlayerState {
    return state;
  }
}


function createPlayer(id: UserId): InternalPlayerInfo {
  return {
    id,
    chipCount: 0,
    chipsInPot: 0,
    cards: [],
    status: PlayerStatus.WAITING,
  };
}