const ChessJS = require('chess.js');
// * https://github.com/jhlywa/chess.js
import {Subject, BehaviorSubject} from 'rxjs';
// import { BehaviourSubject } from 'rxjs';

let promotion = "rnb2bnr/pppPkppp/8/4p3/7q/8/PPPP1PPP/RNBQKBNR w KQ - 1 5"
let staleMate = "4k3/4P3/4K3/8/8/8/8/8 b - - 0 78";
let checkMate = "rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3";
let insuficcientMaterial = "k7/8/n7/8/8/8/8/7K b - - 0 1";

const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

const chess = new Chess();

// todo evaluate if this is really necessary, isn't this the whole point of REACT's state ??
export const gameSubject = new BehaviorSubject()

export function initGame() {
    updateGame();
}

export function resetGame()
{
    chess.reset();
    updateGame();
}

export function getLegalMoves(from)
{
    return (chess.moves({square: from}));
}

// * handles promotion, among other things
export function handleMove(from, to)
{
    const promotions = chess.moves({verbose: true}).filter(m => m.promotion);

    // * check if the move is a promotion, and then add the promotion flag with the notation u want to promote to
    // * big brain comparison: `${move.from}:${move.to}` === `${from}:${to}`
    if (promotions.some((move) => move.from === from && move.to === to)) {
        const pendingPromotion = {from, to, color:promotions[0].color};
        updateGame(pendingPromotion);
    }

    // * put the game on pause if there is a pending promotion
    // * so you can choose your new piece
    const { pendingPromotion } = gameSubject.getValue();
    if (!pendingPromotion) {
        move(from, to);
    } else {
        console.log("not moving because promotion is pending");
    }
}

export function move(from, to, promotion = null)
{
    var move = {from, to};

    if (promotion) {
        move.promotion = promotion;
    }
    // * might need to uppercase this
    const legalMove = chess.move(move);

    // * will return null if not legal, and if legal: an object:
    // * { color: 'w', from: 'g2', to: 'g3', flags: 'n', piece: 'p', san: 'g3' }
    if (legalMove) {
        console.log(chess.fen());

        // * this returns a comment, maybe the opening ?!
        chess.get_comment();

        updateGame();
    } else {
        console.warn("Illegal move");
        // todo here you could check why it's illegal by calling these functions:
        // * .in_check()
        // * ...

    }
}

function updateGame(pendingPromotion=null)
{
    const isGameOver = chess.game_over();

    const newGame = {
        board: chess.board(),
        pendingPromotion,
        isGameOver,
        turn: chess.turn(),
        result: isGameOver ? getGameResult() : null
    };
    gameSubject.next(newGame);
}

function getGameResult()
{
    if (chess.in_checkmate()) {
        const winner = chess.turn() === "w" ? "BLACK" : "WHITE";

        return (`${winner} won by checkmate`)
    } else if (chess.in_draw()) {
        let reason = '50 move rule';

        if (chess.in_stalemate()) {
            reason = "Stalemate";
        }
        if (chess.in_threefold_repetition()) {
            reason = "Repetition";
        }
        if (chess.insufficient_material()) {
            reason = "Insufficient material";
        }
        return (`DRAW - ${reason}`);
    } else {
        return ("Game over, for some reason");
    }
}