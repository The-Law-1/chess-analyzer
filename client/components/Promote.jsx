import { Box, Image, SimpleGrid } from '@chakra-ui/react';
import React from 'react';
import BoardElement from './BoardElement';
import Piece from './Piece';
import PieceContainer from './PieceContainer';
import Square from './Square';
import styled from '@emotion/styled';
import { move } from '../lib/game';

const PieceContainerPoint = styled(PieceContainer)`
    cursor: pointer;
`

const promotionPieces = ['r', 'n', 'b', 'q']

function Promote({promotion}) {
    var color = promotion.color;

    // const pieceImg = `/pieces/${notation}_${color}.png`;

    return (
        //#region //* Grid approach
        // * it's a good try but the boardelement approach is tried and tested
        // <SimpleGrid columns={2}>
        //     {
        //         promotionPieces.map((notation, index) => {
        //             return (
        //                 <Box maxW='90%' key={index}>
        //                         <Image src={`/pieces/${notation}_${color}.png`} alt={notation}>
        //                         </Image>
        //                 </Box>
        //             )
        //         })
        //     }
        // </SimpleGrid>
        //#endregion

        <BoardElement>
            {
                promotionPieces.map((notation, index) => {
                    return (

                        <Box width='50%' height='50%' key={index}>
                            <Square isBlack={index % 3 === 0}>

                                <PieceContainerPoint onClick={() => move(promotion.from, promotion.to, notation)}>
                                    <Image maxW='70%' maxH='70%' src={`/pieces/${notation}_${color}.png`} alt={notation}>
                                    </Image>
                                </PieceContainerPoint>
                            </Square>
                        </Box>
                    )
                })
            }
        </BoardElement>

    );
}

export default Promote;