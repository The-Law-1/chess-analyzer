import Head from "next/head";
import { Box, Container } from "@chakra-ui/react";

const Main = ({children, router}) => {
    return (
        // * pb = padding-bottom
        // * https://chakra-ui.com/docs/features/style-props
        // * https://chakra-ui.com/docs/layout/box
        <Box as="main" pb={8}>
            <Head>
                <meta name="viewport" content="width=device-width initial-scale=1" />
                <title>
                    Chess analyser
                </title>
            </Head>

            {/*
                // * container.md = medium
                // * pt = padding-top
                // *https://chakra-ui.com/docs/layout/container
            */}
            <Container maxW="container.md" pt={14}>
                {children}
            </Container>
        </Box>
    );
}

export default Main;