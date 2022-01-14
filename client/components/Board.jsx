import React, { useEffect, useState } from "react";
import styled from '@emotion/styled';
import BoardSquare from "./BoardSquare";
import BoardElement from "./BoardElement";
import { getLegalMoves } from "../lib/game";

// const BoardElement = styled.div`
//     width: 100%;
//     height: 100%;
//     display: flex;
//     flex-wrap: wrap;
// `

const SquareElement = styled.div`
    width: 12.5%;
    height: 12.5%;
`

const Board = ({board, turn, flipView}) => {

    const [currentBoard, setCurrentBoard] = useState([]);
    const [legalMoves, setLegalMoves] = useState([]);

    // * this is what will refresh your board when it changes
    useEffect(() => {
        // * make it 1D
        setCurrentBoard(
                    flipView ? board.flat().reverse() : board.flat()
                );
            // turn === 'w' ? board.flat() : board.flat().reverse()
    }, [board, flipView]);

    function getCoordinates(i)
    {
        var x = flipView ? Math.abs((i % 8) - 7) : i % 8;
        // * -7 I think because it starts from the right ? but try with/without
        var y = flipView ? Math.floor(i / 8) : Math.abs(Math.floor(i / 8) - 7);

        return ({x, y})
    }

    //* https://www.chess.com/forum/view/general/knowing-the-colour-of-every-square-on-a-chessboard2
    // * or you could have used chess.square_color('h1')...
    function isSquareBlack(i) {
        const { x, y } = getCoordinates(i)
        return (x + y) % 2 === 1
    }

    function getAlgebraicPosition(i) {
        const { x, y } = getCoordinates(i)
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
        var file = files[x];
        var rank = y + 1; // * y starts at 0

        return `${file}${rank}`
    }

    function GetLegalMoves(fromPosition)
    {
        // * call the game library
        let moves = getLegalMoves(fromPosition);
        // * remove the letter notation so you just get the square
        console.log("Full legal: ", moves);

        
        moves = moves.map((val, i) => {
            
            // * translate castle notation
            if (val === 'O-O-O') {
                return (turn === 'w' ? 'c1' : 'c8');
            }
            if (val === 'O-O') {
                return (turn === 'w' ? 'g1' : 'g8');
            }
            // * if it contains an = that's a promotion, cut off at the '='
            if (val.includes('=')) {
                val = val.split('=')[0];
            }
            if (val.includes('+')) {
                val = val.slice(0, -1);
            }
            return (val.slice(-2));
        });

        // * updateLegalMoves
        legalMoves = moves;
        setLegalMoves(moves);
        // ! not sure how soon this updates/rebuilds
        console.log("All legal moves in position: ", moves);
    }

    return (
        <BoardElement className="board">

            {/* {JSON.stringify(board)} */}
            {/* //* creates a 'div' for each piece */}
            {/* //* cf: https://reactjs.org/docs/lists-and-keys.html */}
            {currentBoard.map((piece, i) => (
                    <SquareElement key={i}>
                        <BoardSquare
                            piece={piece}
                            isBlack={isSquareBlack(i)}
                            position={getAlgebraicPosition(i)}
                            getMovesCallback={(position) => GetLegalMoves(position)}
                            clearMovesCallback={() => setLegalMoves([])}
                            isLegalMoveSquare={legalMoves.includes(getAlgebraicPosition(i))}
                            >

                        </BoardSquare>
                    </SquareElement>
                )
            )}
        </BoardElement>
    )
}

export default Board;