import { Global } from '@emotion/react';

// ! careful, if you change this, change the names in logo.js and theme.js
const Fonts = () => (

    <Global
        styles={`
            @import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;700&display=swap");
        `}
    />
);

// * M Plus Rounded 1c
// @import url("https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@300;700&display=swap");

// * Comic Neue (comic sans)
// @import url("https://fonts.googleapis.com/css?family=Comic+Neue:wght@300;700&display=swap");

// * open sans
// @import url("https://fonts.googleapis.com/css?family=Open+Sans:wght@300;700&display=swap");

export default Fonts;