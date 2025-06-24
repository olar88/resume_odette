import React, { useState, useEffect } from 'react'


/** 畫面區塊提示語 
 * @param {String} mainText 主要提示警語(橘色)
 * @param {String} minorText 次要提示說明(綠色)
*/
function GameAlertResult(props: {
    /**@description 主要提示警語(橘色) */
    mainText: string,
    /**@description 次要提示說明(綠色) */
    minorText: string,
}) {


    return <React.Fragment>
        <div className='title-S w-100' style={{ color: 'black' }}>
            <div style={{ color: 'var(--dark_Or)' }}>{props.mainText}</div>&nbsp;
            <div style={{ color: 'var(--dark_Gr)', fontSize: '.8rem' }}>{props.minorText}</div>
        </div>
    </React.Fragment>
}

export { GameAlertResult }