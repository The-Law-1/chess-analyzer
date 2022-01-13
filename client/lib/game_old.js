const Chess = require('chess');

import {Subject, BehaviorSubject} from 'rxjs';
// import { BehaviourSubject } from 'rxjs';

const chess = Chess.create("rnb2bnr/pppPkppp/8/4p3/7q/8/PPPP1PPP/RNBQKBNR w KQ - 1 5")

console.log("Board = ", chess.getStatus().board.squares)

export const gameSubject = new BehaviorSubject({
    board: chess.getStatus().board.squares
})

export function move(piece, to)
{
    console.log(piece, to);

    try {

        var moveState = chess.move(`${piece}${to}`);
        console.log(moveState);

        gameSubject.next({board: chess.getStatus().board.squares})
    } catch (e) {
        console.warn("Error: " + e);
    }
}