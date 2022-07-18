import React, { useEffect, useState } from 'react';

import useCountPrimeNumbers from './useWorker';

const WebWorkerExample = () => {
    const [targetNum, setTargetNum ] = useState<number>()
    const { count, isRunning } = useCountPrimeNumbers(targetNum)

    if(count){
        return <span>{count} prime numbers less than 1,000,000</span>
    }
    
    if(isRunning){
        return <span>claculating...</span>
    }

    return (
        <div onClick={setTargetNum.bind(null, 1000000)}>click to do get count of primes less than 1,000,000</div>
    );
};

export default WebWorkerExample;
