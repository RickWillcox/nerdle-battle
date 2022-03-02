import { Player, UserId } from '../api/types';

export function getPlayerIndexFromUserId(allPlayers: Player[], userId: UserId) {
    allPlayers.findIndex((player) => player['id'] === userId);
}
