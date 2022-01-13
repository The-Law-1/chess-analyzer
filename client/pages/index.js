import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, {useEffect, useState} from 'react';
import { Heading, Container, Box, Button, Center, Text, Flex } from '@chakra-ui/react';
import {gameSubject, initGame, resetGame} from '../lib/game';
import Board from '../components/Board';

const Page = () => {


	const [board, setBoard] = useState([])
	const [isGameOver, setIsGameOver] = useState(false);
	const [gameResult, setGameResult] = useState();
	const [turn, setTurn] = useState('w'); // * white always starts
	const [flipView, setFlipView] = useState(false);

	useEffect(() => {

		initGame();
		// * keeps our board synced with the chess game
		const subscription = gameSubject.subscribe((game) => {

			setBoard(game.board);
			setIsGameOver(game.isGameOver)
			setGameResult(game.result);
			setTurn(game.turn);
		});

		return (() => subscription.unsubscribe)
	}, []);

	function flipBoard()
	{
		setFlipView(!flipView);
	}

	return (
		<Flex align='center' w='container.lg'>
			<Box>
				<Text>
					Time1
				</Text>
				<Button onClick={() => flipBoard()}>
					switch sides
				</Button>
				<Text>
					Time2
				</Text>
			</Box>

			<Container justifyContent backgroundColor='rgb(34,34,34)' maxW='600px'>
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
				<Box maxWidth='600px' h='600px'>
					{/* {boardElement} */}
					<Board board={board} turn={turn} flipView={flipView}>
					</Board>
				</Box>
				{/* //* board-container */}
			</Container>

			<Box width='300px' height='100%' bg='tomato'>
				Hi !
			</Box>
		</Flex>

  	);
};

export default Page;