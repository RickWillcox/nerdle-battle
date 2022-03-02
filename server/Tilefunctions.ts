import {BoardState, GuessRow} from "../api/types"

export function getNextAvailableTileIndex(boardState : BoardState) : number{
    let currentGuessRow : GuessRow = boardState[boardState.length - 1]
    let indexOfNextAvailableTile = currentGuessRow.findIndex(
        (tile) => tile.char === ""
    ) 
    // returns index or -1 if not found
    return indexOfNextAvailableTile
}

export function getLastTileChangedIndex(boardState : BoardState){
    console.log(boardState)
    let currentGuessRow : GuessRow = boardState[boardState.length-1]
    let indexOfLastTileChanged = currentGuessRow.findIndex(
        (tile) => tile.char === ""
    )
    // returns index or -1 if no entries in guessrow yet
    if (indexOfLastTileChanged === 0){
        return -1
    }
    return indexOfLastTileChanged -1

}