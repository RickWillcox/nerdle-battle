import { Player, UserId } from '../api/types';

export function getPlayerIndexFromUserId(allPlayers: Player[], userId: UserId): number {
    return allPlayers.findIndex((player) => player['id'] === userId);
}

export function scrubCharForOtherPlayers(playersArray: Player[], userId: UserId): Player[] {
    return playersArray.map((player) => {
        return {
            id: player.id,
            gameBoard: player.gameBoard.map((guessRow) => {
                return guessRow.map((tile) => {
                    return player.id === userId ? tile : { state: tile.state };
                });
            }),
        };
    });
}

// console.log(userId);
// playersArray.forEach((p) => {
//     console.log(p.gameBoard);
// });

// export function scrubCharForOtherPlayers(playersArray: Player[], userId: UserId): Player[] {
//     playersArray.forEach((player) => {
//         if (player.id !== userId) {
//             player.gameBoard.forEach((guessRow) => {
//                 guessRow.forEach((tile) => {
//                     tile.char = '8'; // Why no work? https://www.typescriptlang.org/play?#code/FAGwpgLgBAHlC8UDawpQN5QJYBMBcUA5AIyEA0UA5gIYC2YAQgPbUBO+yKamAzhNRDAFiFAMYALNgRKEoAXzKoMUPgKFQRUCVKKl5wALoH5i7tg6EATOSp1GLdgSRdlqwQQDMYya2nWTSrz87lBeWj5+snKGxtFmuNIeNjT0zGwczoEqweph2r5ESQFmbrneOoRF0Ub6hsCgkFAArjxgrACSOAhQAESWPfUwAHQAZkysAKLUEgAUMwAOAJTwAHzoSlgjUAtDuFAAhPCILW2di+toaPNDKfbpo+NTszOsTADuiwgrGEqXUK9vB6TabiOYQLDgT6rH5-P7g8BDfLdHoADQGsPki1+mKU0TkWOAoiYADseEwESAmJQZjBFkA
//                 });
//             });
//         }
//     });
//     return playersArray;
// }
