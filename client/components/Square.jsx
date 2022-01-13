import { Box, Container } from '@chakra-ui/react';
import React from 'react';
import styled from '@emotion/styled';

// * as far as I can tell, this is useless
const Square = ({ children, isBlack }) => {

    return (
        <Box width='100%' height='100%' backgroundColor={isBlack ? '#F0D9B5' : '#B59963'}>
            {children}
        </Box>
    );
}

export default Square;