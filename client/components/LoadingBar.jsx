import styled from '@emotion/styled';
import React from 'react';

const BarOutline = styled.div`
    background-color: #FFFFFF;
    position: relative;
    margin: 15px;
    margin-top: 10px;
    height: 500px;
    width: 30px;
    display: inline-flex;
    vertical-align: middle;
`

const LoadingBar = React.forwardRef(({ children, progress = 75}, ref) =>
{
    const fillColor = '#484848';
    const targetBarStyle = {
        background: `${fillColor}`,  /* fallback for old browsers */
        width: '100%',
        height: `${progress}%`,
        opacity: 1,
        color: '#fff',
        display: 'flex',
        'alignItems': 'center',
        'justifyContent': 'center',
    }

    return(
        <BarOutline ref={ref}>
            <div style={targetBarStyle}>
                {children}
            </div>
        </BarOutline>
    )
})

export default LoadingBar;