import { Box, position, SimpleGrid, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {gameSubject, initGame, playMove, undoLastMove, getGameHistory, resetGame, GetFEN, LoadFEN} from '../lib/game';
import { analysePositions } from '../api/EngineApi'

function AnalysisSection({newPGNValue}) {

	const [history, setHistory] = useState([]);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const [fenPositions, setFenPositions] = useState([]);
    const [positionScores, setPositionScores] = useState([]);

    // TODO get all the scores for each position by sending the full position array

    function keyUpHandler({key}) {

        // todo double check that you are focused on the window and not on like a text area

        if (key === "ArrowLeft") {
            if (currentMoveIndex > -1) {
                currentMoveIndex -= 1;
                PlayMoveAtIndex(currentMoveIndex);

                // // ? not sure how useful it is to setCurrentMoveIndex this way
                // setCurrentMoveIndex(currentMoveIndex);
                // undoLastMove();
            }

        } else if (key === "ArrowRight") {

            if (currentMoveIndex < history.length - 1) {

                currentMoveIndex++;

                PlayMoveAtIndex(currentMoveIndex);
                // // ? not sure how useful it is to setCurrentMoveIndex this way
                // setCurrentMoveIndex(currentMoveIndex);
                // playMove(history[currentMoveIndex].san);
            }
            // * a little trickier, play the next move in store
            // * that means keeping track of the current index
            // * and you play the move at idx+1
        }
    }

    function PlayMoveAtIndex(i)
    {
        setCurrentMoveIndex(i);
        currentMoveIndex = i;
        LoadFEN(fenPositions[i]);
        console.log(fenPositions[i]);
        // * load fen
    }

    function GenerateFenPositions()
    {
        // * reset the game to zero
        resetGame();
        // * loop over the history
        for (let i = 0; i < history.length; i++) {
            const move = history[i].san;

            // * play each move, and get the fen each time
            playMove(move);

            // * get the fen notation
            fenPositions[i] = GetFEN();
            setFenPositions(fenPositions);
        }
    }

    async function GetAnalysisForMoves()
    {
        let positionsPayload = {
            fenPositions: [],
            maxDepth: 12
        };

        console.log("Analysing...");
        positionsPayload.fenPositions = fenPositions;
        await analysePositions(positionsPayload)
        .then(res => {
            if (res.status === 200) {
                console.log("Got analysis': ", res);
                // * setstate
                positionScores = res;
                setPositionScores(res);
            } else {
                alert("Could not retrieve analysis");
            }
        })
        .catch(err => {
            alert("Invalid request");
        })
    }

    // ! you can't subscribe to the game otherwise you lose the history (undo)
	useEffect(() => {
        initGame();

        let chessHistory = getGameHistory();

        setHistory(chessHistory);
        history = chessHistory;
        setCurrentMoveIndex(chessHistory.length - 1)
        currentMoveIndex = chessHistory.length - 1;
        GenerateFenPositions();

        GetAnalysisForMoves();

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
                        <Text
                            maxWidth={(move.san.length + 3 + i % 10) + 'ch'}
                            backgroundColor={i === currentMoveIndex ? '#4A5568' : ""}
                            as="i"
                            key={i}
                            cursor="pointer"
                            onClick={() => PlayMoveAtIndex(i)}
                            >
                            {(i % 2 === 0) &&
                                i / 2 + 1 + ". "
                            }
                            {move.san}

                            {(i % 2 === 1) &&
                                <br/>
                            }
                            {
                                (i === currentMoveIndex) &&
                                    <Box
                                        backgroundColor='#4A5568'>
                                        Hey there, I will show you what's what here !
                                    </Box>
                            /* // todo | if the currentMoveIndex === i
                                // todo | open a box that shows the score of the move you played
                                // todo | and another box that shows the best move, and the score with the best move
                             */}
                        </Text>
                    ))
                }
            </SimpleGrid>
        </Box>
    );
}

export default AnalysisSection;