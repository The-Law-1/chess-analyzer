import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, {useEffect, useState} from 'react';
import { Heading, Container, Box, Button, Center, Text, Flex, Input, Textarea } from '@chakra-ui/react';
import {gameSubject, initGame, resetGame, LoadPGN} from '../lib/game';
import Board from '../components/Board';
import AnalysisSection from '../components/AnalysisSection';

const Page = () => {

	const [board, setBoard] = useState([])
	const [isGameOver, setIsGameOver] = useState(false);
	const [gameResult, setGameResult] = useState();
	const [turn, setTurn] = useState('w'); // * white always starts
	const [flipView, setFlipView] = useState(false);
    const [pgnValue, setPGNValue] = useState("");

    const [analyserProp, setAnalyserProp] = useState("");

    const handlePGNChange = (event) => setPGNValue(event.target.value);

    function LoadNewPGN()
    {
        // * call the game and give him the PGN
        let success = LoadPGN(pgnValue);
        if (success === false) {
            console.warn("Failed to load PGN");
            setAnalyserProp("");
        }
        setAnalyserProp(pgnValue);
    }

	useEffect(() => {

		initGame();
		// * keeps our board synced with the chess game
		const subscription = gameSubject.subscribe((game) => {

			setBoard(game.board);
			setIsGameOver(game.isGameOver)
			setGameResult(game.result);
			setTurn(game.turn);
		});

		return (() => subscription.unsubscribe())
	}, []);

	function flipBoard()
	{
		setFlipView(!flipView);
	}

	return (
        <div>
            <Box>
                <Textarea placeholder="Chess game in PGN format" onChange={handlePGNChange} />
                <Button
                    _focus={{outline:"none"}}
                    onClick={LoadNewPGN}>
                    Load PGN
                </Button>
            </Box>

            <Flex align='center'>
                {/* // * switch side button, room for time also probably  */}
                <Box>
                    {/* <Text>
                        Time1
                    </Text> */}
                    <Button
                        _focus={{outline:"none"}}
                        onClick={() => flipBoard()}>
                        switch sides
                    </Button>
                    {/* <Text>
                        Time2
                    </Text> */}
                </Box>

                {/* // * contains the board */}
                <Container backgroundColor='rgb(34,34,34)' minW='600px' maxW='600px'>
                    {/* //* board-container */}
                    <Box maxWidth='600px' h='600px'>
                        {/* {boardElement} */}
                        <Board board={board} turn={turn} flipView={flipView}>
                        </Board>
                    </Box>
                    {/* //* board-container */}
                    {isGameOver && (
                        <Heading padding='10px' textAlign={"center"} as="h2" size='sm'>
                            GAME OVER
                            <br/>
                            {gameResult}

                            <br/>
                            <Button onClick={() => resetGame()}>
                                New game
                            </Button>
                        </Heading>
                    )}
                </Container>

                <Container width='600px' backgroundColor='black'>
                    <AnalysisSection newPGNValue={analyserProp}/>
                </Container>
            </Flex>
        </div>

  	);
};

export default Page;