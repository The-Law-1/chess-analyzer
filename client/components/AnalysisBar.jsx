import React from "react";
import LoadingBar from './LoadingBar';
import { Box } from '@chakra-ui/react';


function AnalysisBar({score}) {


    // * https://gist.github.com/xposedbones/75ebaef3c10060a3ee3b246166caab56
    const mapValue = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;

    // * from -20 to 20, to 0 - 100
    function NormalizeScore(value)
    {
        let newVal = mapValue(value, -20, 20, 0, 100);
        return (newVal);
    }

    return (<div>
                <Box textAlign='center'>
                    {score}
                </Box>
                {/* // todo calculate and normalize score  */}
                {/* // * max score is 20 */}
                <LoadingBar progress={NormalizeScore(score)} />
            </div>);
}

export default AnalysisBar;