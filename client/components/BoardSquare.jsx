import React, { Component, useEffect, useState} from 'react';
import Square from './Square';
import Piece from './Piece';
import { Box, Center, Circle, CircularProgress, GridItem, SimpleGrid, Spinner, Stack, Text } from '@chakra-ui/react';
import { useDrop } from 'react-dnd';
import { createPortal } from 'react-dom';
import { handleMove } from '../lib/game';
import {gameSubject} from '../lib/game';
import Promote from './Promote';

const BoardSquare = ({piece, isBlack, position, getMovesCallback, clearMovesCallback, isLegalMoveSquare}) => {

    const [promotion, setPromotion] = useState(null);
    const [file, setFile] = useState(position[0]);
    const [rank, setRank] = useState(position[1]);
    const [squareNotation, setSquareNotation] = useState([]);

    const [ , drop] = useDrop({
        accept: 'piece',
        drop: (item) => {
            // * clear the playable squares
            console.log("dropped: ", item);
            clearMovesCallback();
            handleMove(item.position, position);
        }
    });


    function ShowNotation()
    {
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
    }

    // * runs every position change
    useEffect(() => {
        const subscription = gameSubject.subscribe(({pendingPromotion}) => {
            // * if someone is promoting to this square
            if (pendingPromotion !== null && pendingPromotion.to === position) {
                setPromotion(pendingPromotion);
            } else {
                setPromotion(null);
            }
        })

        ShowNotation();

        // * unsub once you stop rendering
        return (() => subscription.unsubscribe());
    }, [position]);

    function BeganMovingPiece()
    {
        getMovesCallback(position);
    }

    return (
        <Box width='100%' height='100%' ref={drop}>
            <Square isBlack={isBlack}>
                {
                    (isLegalMoveSquare && piece) &&
                    <CircularProgress value={100} thickness='10px' color='gray' size='24%' position='absolute'>

                    </CircularProgress>
                }
                {
                    (isLegalMoveSquare && !piece) &&
                    <CircularProgress value={100} thickness='10%' color='gray' size='24%' position='absolute'>

                    </CircularProgress>
                }
                {
                    (!promotion && squareNotation.length > 0) &&
                        <Text position={'absolute'} color={isBlack ? "black" : "white"} >
                            {squareNotation}
                        </Text>
                }

                { promotion && <Promote promotion={promotion}/>}

                {(piece && !promotion) && <Piece startMoveCallback={() => BeganMovingPiece()} piece={piece} position={position}/>}
            </Square>
        </Box>
    )

}

export default BoardSquare;