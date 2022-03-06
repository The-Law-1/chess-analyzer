import { Box, Button, Center, Flex, GridItem, IconButton, position, SimpleGrid, Slider, SliderFilledTrack, SliderTrack, Spinner, Text, Tooltip } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {gameSubject, initGame, playMove, undoLastMove, getGameHistory, resetGame, GetFEN, LoadFEN, move} from '../lib/game';
import { analysePositions } from '../api/EngineApi'
import AnalysisBar from './AnalysisBar';

function AnalysisSection({newPGNValue}) {

	const [history, setHistory] = useState([]);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const [fenPositions, setFenPositions] = useState([]);
    const [positionScores, setPositionScores] = useState([]);
    const [moveEvals, setMoveEvals] = useState([]);

    function PlayMoveAtIndex(i)
    {
        if (i < history.length && i >= 0) {

            setCurrentMoveIndex(i);
            currentMoveIndex = i;
        }
    }


    function ShowPlayerSummary(side)
    {
        let bestMoves = 0;
        let greatMoves = 0;
        let blunders = 0;
        let inaccuracies = 0;
        let goodMoves = 0;

        for (let i = 0; i < moveEvals.length; i++) {
            if (side === "White" && i % 2 === 1)
                continue;
            if (side === "Black" && i % 2 === 0)
                continue;

            const moveEval = moveEvals[i];
            if (moveEval === null || moveEval === undefined)
                continue;

            switch (moveEval.evaluation) {
                case "bestMove":
                    bestMoves++;
                    break;
                case "inaccuracy":
                    inaccuracies++;
                    break;
                case "good":
                    goodMoves++;
                    break;
                case "blunder":
                    blunders++;
                    break;
                case "great":
                    greatMoves++;
                    break;
                default:
                    break;
            }
        }

        // * texts or spans
        return (
            <div>
                <Text color="white">
                    {side} played {" "}
                </Text>
                <Text color="red">
                    {blunders + " "} blunders {" "}
                </Text>
                <Text color="yellow">
                    {inaccuracies + " "} inaccuracies {" "}
                </Text>
                <Text color="green.100">
                    {goodMoves + " "} good moves {" "}
                </Text>
                <Text color="green.200">
                    {greatMoves + " "} great moves {" "}
                </Text>
                <Text color="green.300">
                    {bestMoves + " "} best moves
                </Text>
            </div>
        )
    }

    function EvaluateAllMoves()
    {
        // * loop over the positions and evaluate each one, save the results in the object
        for (let i = 0; i < history.length; i++) {
            let moveEvaluationObject = EvaluateMove(i);

            moveEvals[i] = moveEvaluationObject;
            setMoveEvals(moveEvals);
        }
        PlayMoveAtIndex(0);
    }

    function EvaluateMove(moveIndex)
    {
        if (positionScores.length === 0) {
            return (null);
        }
        if (moveIndex === 0) {
            return (null);
        }
        let playerColor = moveIndex % 2 === 0 ? "white" : "black";
        // * get the move
        let move = history[moveIndex].from + history[moveIndex].to;
        // * get the best move
        let bestMove = positionScores[moveIndex].bestmove;
        // * get the current move score
        let moveScore = positionScores[moveIndex].bestLines[0].score / 100.0;
        // * get the previous move score
        let prevMoveScore = positionScores[moveIndex - 1].bestLines[0].score / 100.0;

        let discrepancy = prevMoveScore - moveScore;

        console.log("Discrepancy for move index " + moveIndex + " " + discrepancy);

        // * if negative and player === white -> good else: bad

        let qualifier = 0;

        if (playerColor === "white") {
            qualifier = discrepancy < 0 ? 1 : -1;
        } else {
            qualifier = discrepancy > 0 ? 1 : -1;
        }

        if (move === bestMove) {
            return ({
                    element:
                        <Text
                        color="green">
                                {" "} is the best move !
                        </Text>,
                    evaluation: "bestMove"
                }
            )
        }

        if (Math.abs(discrepancy) < 0.5) {
            // * it was an okay move either way
            let description = qualifier < 0 ? "not great" : "not bad";
            return ({
                    element:
                    <Text
                    color="yellow">
                        {" "} is an okay move {" " + description}
                    </Text>,
                    evaluation: qualifier < 0 ? "inaccuracy" : "good"
                }
            );
        }

        if (Math.abs(discrepancy) > 1) {
            // * it was either good or bad
            let description = qualifier < 0 ? "bad move..." : "good move";

            return ({
                    element:
                    <Text
                    color={qualifier < 0 ? "red" : "green"}>
                    {" "} is a {" " + description}
                    </Text>,
                    evaluation: qualifier < 0 ? "blunder" : "great"
                }
            );
        }
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

    function keyUpHandler({key})
    {
        if (key === "ArrowRight") {
            PlayMoveAtIndex(currentMoveIndex + 1);
        } else if (key === "ArrowLeft") {
            PlayMoveAtIndex(currentMoveIndex - 1);
        }
    }

    useEffect(() => {
        if (fenPositions.length > 0) {
            console.log("Using currentMove index: ", currentMoveIndex);
            LoadFEN(fenPositions[currentMoveIndex]);
        }

        // * in case there was one already
        window.removeEventListener("keyup", keyUpHandler);
        window.addEventListener("keyup", keyUpHandler);

        return (() => {
            window.removeEventListener("keyup", keyUpHandler);
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
            GetAnalysisForMoves()
            .then(() => {
                EvaluateAllMoves();
            })
        }
        console.log("History length: ", history.length);

        // * in case there was one already
        // window.removeEventListener("keyup", keyUpHandler);
        // window.addEventListener("keyup", keyUpHandler);

		return (() => {
            // window.removeEventListener("keyup", keyUpHandler);
        })
	}, [newPGNValue]);

    // todo decompose this into sub-components
    return (
        <>
            <Flex>
                <div>
                    <Flex justifyContent='space-between'>
                        {(history.length > 0 && moveEvals.length === 0) &&
                            <Spinner/>
                        }
                        {(history.length > 0 && moveEvals.length === 0) &&
                            <Spinner/>
                        }
                        <>
                            {moveEvals.length > 0 &&
                            ShowPlayerSummary("White")}
                        </>
                        <>
                            {moveEvals.length > 0 &&
                            ShowPlayerSummary("Black")}
                        </>
                    </Flex>
                    <SimpleGrid spacingX={10} height='500px'width='300px' templateColumns='repeat(2, 1fr)' overflowY='scroll'>
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
                                            w="200%"
                                            background='gray'
                                            >
                                                {(i === currentMoveIndex && moveEvals.length > 0 && moveEvals[i] !== null && moveEvals[i] !== undefined) && 
                                                moveEvals[i].element}

                                                { history[i].san + " "}

                                                {
                                                    positionScores.length > 0 &&
                                                    (positionScores[i].bestLines[0].score / 100.0)
                                                }
                                                <br/>
                                                {
                                                    positionScores.length > 0 &&
                                                    "best: " + positionScores[i].bestmove
                                                }
                                                {
                                                    positionScores.length === 0 &&
                                                    <Spinner/>
                                                }
                                        </Box>
                                    }
                                </Box>

                            ))
                        }
                    </SimpleGrid>

                    {/* // todo show the total okay/good/bad/best moves */}
                    <Flex>
                        <IconButton
                            color="gray.100"
                            icon={<ChevronLeftIcon/>}
                            onClick={() => PlayMoveAtIndex(currentMoveIndex - 1)}
                            >
                        </IconButton>
                        <IconButton
                            color="gray.100"
                            icon={<ChevronRightIcon/>}
                            onClick={() => PlayMoveAtIndex(currentMoveIndex + 1)}
                            >
                        </IconButton>
                    </Flex>

                </div>
                <AnalysisBar
                    score={
                        (positionScores.length > 0 && currentMoveIndex !== -1)
                        ? positionScores[currentMoveIndex].bestLines[0].score / 100.0
                        : 0
                    }/>

            </Flex>

        </>
    );
}

export default AnalysisSection;