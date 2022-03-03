import { Player, UserId } from '../api/types';

export function getPlayerIndexFromUserId(allPlayers: Player[], userId: UserId): number {
    return allPlayers.findIndex((player) => player['id'] === userId);
}

export function removeDataForOtherPlayers(playersArray: Player[], userId: UserId): Player[] {
    return playersArray.map((player) => {
        return {
            inputBoard: player.inputBoard.map((input) => {
                return player.id === userId ? input : {};
            }),
            id: player.id,
            gameBoard: player.gameBoard.map((guessRow) => {
                return guessRow.map((tile) => {
                    return player.id === userId ? tile : { state: tile.state };
                });
            }),
        };
    });
}
