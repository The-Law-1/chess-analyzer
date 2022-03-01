import { Box, Button, Center, Flex, GridItem, IconButton, position, SimpleGrid, Spinner, Text } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {gameSubject, initGame, playMove, undoLastMove, getGameHistory, resetGame, GetFEN, LoadFEN} from '../lib/game';
import { analysePositions } from '../api/EngineApi'

function AnalysisSection({newPGNValue}) {

	const [history, setHistory] = useState([]);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const [fenPositions, setFenPositions] = useState([]);
    const [positionScores, setPositionScores] = useState([]);

    // todo this is not working out, figure out a different way to navigate, buttons or something
    function keyUpHandler(key) {


        console.log("Current move index ", currentMoveIndex);

        if (key === "ArrowLeft") {
            if (currentMoveIndex > -1) {
                PlayMoveAtIndex(currentMoveIndex - 1);

                // // ? not sure how useful it is to setCurrentMoveIndex this way
                // setCurrentMoveIndex(currentMoveIndex);
                // undoLastMove();
            }

        } else if (key === "ArrowRight") {

            if (currentMoveIndex < history.length - 1) {

                PlayMoveAtIndex(currentMoveIndex + 1);
                // // ? not sure how useful it is to setCurrentMoveIndex this way
                // setCurrentMoveIndex(currentMoveIndex);
                // playMove(history[currentMoveIndex].san);
            }
        }
    }

    function PlayMoveAtIndex(i)
    {
        if (i < history.length && i >= 0) {

            setCurrentMoveIndex(i);
            currentMoveIndex = i;
        }
        // useeffect will load the appropriate fen
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
                // * setstate
                positionScores = res.data;
                setPositionScores(res.data);
                console.log("Got analysis': ", res);
                console.log(positionScores[0].bestLines);
            } else {
                alert("Could not retrieve analysis");
            }
        })
        .catch(err => {
            alert("Invalid request " + err);
        })
    }

    useEffect(() => {
        if (fenPositions.length > 0) {
            console.log("Using currentMove index: ", currentMoveIndex);
            LoadFEN(fenPositions[currentMoveIndex]);
        }
        // window.removeEventListener("keyup", keyUpHandler);
        // window.addEventListener("keyup", keyUpHandler);

        return (() => {
            // window.removeEventListener("keyup", keyUpHandler);
        })
    }, [currentMoveIndex])

    // ! you can't subscribe to the game otherwise you lose the history (undo)
	useEffect(() => {
        initGame();

        let chessHistory = getGameHistory();

        setHistory(chessHistory);
        history = chessHistory;
        setCurrentMoveIndex(chessHistory.length - 1);
        currentMoveIndex = chessHistory.length - 1;

        if (history.length > 0) {
            GenerateFenPositions();
            GetAnalysisForMoves();
        }
        console.log("History length: ", history.length);

        // * in case there was one already
        // window.removeEventListener("keyup", keyUpHandler);
        // window.addEventListener("keyup", keyUpHandler);

		return (() => {
            // window.removeEventListener("keyup", keyUpHandler);
        })
	}, [newPGNValue]);

    return (
        <div>
            <SimpleGrid spacingX={10} height='500px' templateColumns='repeat(2, 1fr)' overflowY='scroll'>
                {
                    history.map((move, i) => (

                        <Box
                            key={i}>

                            <Text
                                // maxWidth={(move.san.length + 3 + i % 10) + 'ch'}
                                maxWidth='10ch'
                                backgroundColor={i === currentMoveIndex ? '#4A5568' : ""}
                                as="i"
                                scrollBehavior="smooth"
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
                            </Text>

                            {/* //! ask someone how to get this box to span the whole grid */}
                            {
                                (i === currentMoveIndex) &&
                                <Box
                                    w="100%"
                                    background='gray'
                                    >
                                        { history[i].san + " "}

                                        {
                                            positionScores.length > 0 &&
                                            (i % 2 === 0
                                            ? (positionScores[i].bestLines[0].score / 100.0)
                                            : -(positionScores[i].bestLines[0].score / 100.0))
                                        }
                                        <br/>
                                        {
                                            positionScores.length > 0 &&
                                            positionScores[i].bestmove
                                        }
                                        {
                                            positionScores.length === 0 &&
                                            <Spinner/>
                                        }
                                </Box>
                                /*
                                todo | and another box that shows the best move, and the score with the best move
                                */
                            }
                        </Box>

                    ))
                }
            </SimpleGrid>
            <Flex>

                <IconButton
                    icon={<ChevronLeftIcon/>}
                    onClick={() => PlayMoveAtIndex(currentMoveIndex - 1)}
                    >
                </IconButton>
                <IconButton
                    icon={<ChevronRightIcon/>}
                    onClick={() => PlayMoveAtIndex(currentMoveIndex + 1)}
                    >
                </IconButton>
            </Flex>
        </div>
    );
}

export default AnalysisSection;