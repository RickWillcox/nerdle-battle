import { Player, UserId } from '../api/types';

export function getPlayerIndexFromUserId(allPlayers: Player[], userId: UserId): number {
    return allPlayers.findIndex((player) => player['id'] === userId);
}
