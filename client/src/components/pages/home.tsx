import React from 'react';

export const Home: React.VFC = () => {

    return (
        <React.Fragment>
            <div style={{ width: '100%', height: '700px', background: 'black'}}></div>
            <div id="usage" style={{ width: '100%', height: '700px', background: 'green'}}></div>
            <div id="support" style={{ width: '100%', height: '700px', background: 'orange'}}></div>
        </React.Fragment>
    )
}