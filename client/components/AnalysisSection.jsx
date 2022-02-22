import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {gameSubject, initGame, playMove, undoLastMove, getGameHistory} from '../lib/game';

function AnalysisSection({newPGNValue}) {

	const [history, setHistory] = useState([]);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);

    function keyUpHandler({key}) {

        // todo double check that you are focused on the window and not on like a text area

        if (key === "ArrowLeft") {

            if (currentMoveIndex > -1) {
                currentMoveIndex -= 1;
                // ? not sure how useful it is to setCurrentMoveIndex this way
                setCurrentMoveIndex(currentMoveIndex);
                undoLastMove();
            }

        } else if (key === "ArrowRight") {

            if (currentMoveIndex < history.length - 1) {

                currentMoveIndex++;

                // ? not sure how useful it is to setCurrentMoveIndex this way
                setCurrentMoveIndex(currentMoveIndex);
                playMove(history[currentMoveIndex].san);
            }
            // * a little trickier, play the next move in store
            // * that means keeping track of the current index
            // * and you play the move at idx+1
        }
    }

    // ! you can't subscribe to the game otherwise you lose the history (undo)

	useEffect(() => {
        initGame();

        let chessHistory = getGameHistory();

        setHistory(chessHistory);
        history = chessHistory;
        setCurrentMoveIndex(chessHistory.length - 1)
        currentMoveIndex = chessHistory.length - 1;

        // * in case there was one already
        window.removeEventListener("keyup", keyUpHandler);
        window.addEventListener("keyup", keyUpHandler);

		return (() => {
            window.removeEventListener("keyup", keyUpHandler);
        })
	}, [newPGNValue]);

    return (
        <Box>
            <SimpleGrid spacingX={10} columns={[2, 0, 2]}>
                {
                    history.map((move, i) => (

                        //* needs to be clickable and return the game to that point in time
                        <Text maxWidth={(move.san.length + 3 + i % 10) + 'ch'} backgroundColor={i === currentMoveIndex ? '#4A5568' : ""} as="i" key={i} >
                            {(i % 2 === 0) &&
                                i + ". "
                            }
                            {move.san}

                            {(i % 2 === 1) &&
                                <br/>
                            }
                        </Text>
                    ))
                }
            </SimpleGrid>


        </Box>
    );
}

export default AnalysisSection;