import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {gameSubject, initGame, playMove, undoLastMove, getGameHistory} from '../lib/game';

function AnalysisSection({}) {

	const [history, setHistory] = useState([]);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);

    function keyUpHandler({key}) {

        if (key === "ArrowLeft") {
            console.log("Pressed left: ", currentMoveIndex);

            if (currentMoveIndex > -1) {
                console.log("Undo-ing");
                currentMoveIndex -= 1;
                // ? not sure how useful it is to setCurrentMoveIndex this way
                setCurrentMoveIndex(currentMoveIndex);
                undoLastMove();
            }

        } else if (key === "ArrowRight") {
            console.log("Pressed right key");

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

    // * subscribe to the game to keep its history
	useEffect(() => {
        initGame();

        var history = getGameHistory();
        setHistory(history);
        setCurrentMoveIndex(history.length - 1)
        currentMoveIndex = history.length - 1;

        window.addEventListener("keyup", keyUpHandler);

		return (() => {
            window.removeEventListener("keyup", keyUpHandler);
        })
	}, []);

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