import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

// * https://chakra-ui.com/docs/features/color-mode

const styles = {
    global: (props) => ({
        body: {
            // * try to put real values in here somehow
            // * and why do we pass props
            bg: mode('#f0e7db', '#202023')(props)
        }
    })
}

const components = {
    Heading: {
        variants: {
            'section-title': {
                textDecoration: 'underline',
                fontSize: 20,
                textUnderlineOffset: 6,
                textDecorationColor: '#525252',
                textDecorationThickness: 4,
                marginTop: 3,
                marginBottom: 4
            }
        }
    },
    Link: {
        baseStyle: props => ({
            color: mode('#3d7aed', '#ff63c3')(props),
            textUnderlineOffset: 3
        })
    }
}

// ! what is this amateur hour at least use palatino !
const fonts = {
    // heading: "'M PLUS Rounded 1c'"
    heading: 'Open Sans'

}

const colors = {
    glassTeal: '#88ccca'
}

const config = {
    initialColorMode: 'dark',
    useSystemColorMode: false // * beware this configuration, dark mode by default ?
}

const theme = extendTheme({
    config,
    styles,
    components,
    colors,
    fonts
})

export default theme;