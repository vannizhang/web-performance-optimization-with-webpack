import React, { useEffect, useState } from 'react'

import MyWorker from 'worker-loader!./worker';

const countPrimes = async (target:number):Promise<number> => {

    if(!target){
        return 0
    }

    const worker = new MyWorker();

    return new Promise((resolve, reject)=>{
        worker.addEventListener(
            'message',
            function (e) {
                resolve(e.data.message);
            },
            false
        );
    
        worker.postMessage(target);
    })
};


const useCountPrimeNumbers = (targetNum:number) => {

    const [count, setCount] = useState<number>(0)
    const [isRunning, setIsRunning] = useState(false);

    useEffect(()=>{

        if(!targetNum){
            return
        }

        (async()=>{
            setIsRunning(true);

            const res = await countPrimes(targetNum)
            setCount(res)

            setIsRunning(false);
        })()

    }, [targetNum]);

    return {
        count,
        isRunning
    }
}

export default useCountPrimeNumbers