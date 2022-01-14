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
    const [file, setFile] = useState(position[0]);
    const [rank, setRank] = useState(position[1]);
    const [squareNotation, setSquareNotation] = useState([]);

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


        let squareNotationText = "";

        setFile(position[0]);
        setRank(position[1]);
        if (position[1] === '1') {
            squareNotationText = position[0];
        }
        if (position[0] === 'a') {
            squareNotationText += position[1];
        }
        setSquareNotation(squareNotationText);


        // * unsub once you stop rendering
        return (() => subscription.unsubscribe());
    }, [position]);

    return (
        <Box width='100%' height='100%' ref={drop}>
            <Square isBlack={isBlack}>
                {/* //! you need to figure this shit out it is driving me insane, have the text show behind the pieces */}
                {
                    (!promotion && squareNotation.length > 0) &&
                        <Text position={'fixed'} color={isBlack ? "black" : "white"} >
                            {squareNotation}
                        </Text>
                }

                { promotion && <Promote promotion={promotion}/>}

                {(piece && !promotion) && <Piece piece={piece} position={position}/>}
            </Square>
        </Box>
    )

}

export default BoardSquare;