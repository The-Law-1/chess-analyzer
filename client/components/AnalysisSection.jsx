import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import {gameSubject, initGame} from '../lib/game';


function AnalysisSection({}) {

	const [history, setHistory] = useState([]);

    // * subscribe to the game to keep its history
	useEffect(() => {
        initGame();
		const subscription = gameSubject.subscribe((game) => {

            setHistory(game.history);
		});

		return (() => subscription.unsubscribe)
	}, []);

    return (
        <Box overflow='scroll'>
            <SimpleGrid  spacingX={10} columns={[2, 0, 2]}>
                {
                    history.map((move, i) => (

                        //* needs to be clickable and return the game to that point in time
                        <Text as="i" key={i} >
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