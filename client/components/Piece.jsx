import React from 'react';
// import Image from 'next/image';
import { Box, Container, Image, Text } from '@chakra-ui/react';
import { useDrag, useDrop, DragPreviewImage } from 'react-dnd';
import PieceContainer from './PieceContainer';
import styled from '@emotion/styled';

const PieceContainerGrab = styled(PieceContainer)`
    cursor: grab;
`

function Piece({piece, position, startMoveCallback}) {

    var notation = piece.type;
    var color = piece.color;

    // * this doc is weirdly wrong
    // * https://react-dnd.github.io/react-dnd/docs/api/use-drag
    const [ {isDragging}, drag, preview] = useDrag({
        // * this is the data then passed to the drop zone
        type: 'piece',
        item: { id: `${notation}_${color}`, position: position},
        collect: (monitor) => {
            return ({isDragging: !!monitor.isDragging() })
        }
    });

    const pieceImg = `/pieces/${notation}_${color}.png`;

    return (
        <>
            {/* // * this doesn't work in the slightest */}
            <DragPreviewImage connect={preview} src={pieceImg} />

            <PieceContainerGrab position='absolute' onMouseDown={() => startMoveCallback()} ref={drag}
                style={{opacity: isDragging ? 0 : 1}}>
                    <Image maxW='70%' maxH='70%' src={pieceImg} alt={piece.type}>
                    </Image>
            </PieceContainerGrab>
        </>
    );
}

export default Piece;