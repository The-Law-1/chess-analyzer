import React, { Component, useEffect, useState} from 'react';
import Square from './Square';
import Piece from './Piece';
import { Box, GridItem, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { useDrop } from 'react-dnd';
import { createPortal } from 'react-dom';
import { handleMove } from '../lib/game';
import {gameSubject} from '../lib/game';
import Promote from './Promote';

const BoardSquare = ({piece, isBlack, position}) => {

    const [promotion, setPromotion] = useState(null);

    const [ , drop] = useDrop({
        accept: 'piece',
        drop: (item) => {
            console.log("dropped: ", item);
            handleMove(item.position, position);
        }
    });

    useEffect(() => {
        const subscription = gameSubject.subscribe(({pendingPromotion}) => {
            // * if someone is promoting to this square
            if (pendingPromotion !== null && pendingPromotion.to === position) {
                setPromotion(pendingPromotion);
            } else {
                setPromotion(null);
            }
        })

        // * unsub once you stop rendering
        return (() => subscription.unsubscribe());
    }, [position]);

    return (
        <Box width='100%' height='100%' ref={drop}>
            <Square isBlack={isBlack}>
                {/* ! you need to figure this shit out it is driving me insane, have the text show behind the pieces */}
                {/* <Text color='black'>
                    {square.file}
                    {square.rank}
                </Text> */}

                { promotion && <Promote promotion={promotion}/>}

                {(piece && !promotion) && <Piece piece={piece} position={position}/>}
            </Square>
        </Box>
    )

}

export default BoardSquare;