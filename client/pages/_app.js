import { ChakraProvider } from "@chakra-ui/react";
import Layout from "../components/layouts/main";
import Fonts from '../components/fonts';
import theme from '../lib/theme';
import { AnimatePresence } from "framer-motion";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Website = ({ Component, pageProps, router }) => {
    return (
        <DndProvider backend={HTML5Backend}>
            <ChakraProvider theme={theme}>
                <Fonts/>
                <Layout router={router}>
                    {/* * https://www.framer.com/docs/animate-presence/  */}
                    <AnimatePresence exitBeforeEnter initial={true}>
                        <Component {...pageProps} key={router.route}/>
                    </AnimatePresence>
                </Layout>
            </ChakraProvider>
        </DndProvider>
    )
}

export default Website