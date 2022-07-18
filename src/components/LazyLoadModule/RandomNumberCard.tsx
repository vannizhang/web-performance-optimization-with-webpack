import React, { useState } from 'react'

const RandomNumberCard = () => {

    const [randomNum, setRandomNum ] = useState<number>()

    const showRandomNum = async()=>{
        const { generateRandomNumber } = await import(
            /* webpackPrefetch: true */ 
            '../../utils/numbers'
        )
        setRandomNum(generateRandomNumber(50, 100))
    }

    return (
        <div>
            <div onClick={showRandomNum}>get a random number</div>
            { randomNum !== undefined && <span>{randomNum}</span>}
        </div>
    )
}

export default RandomNumberCard