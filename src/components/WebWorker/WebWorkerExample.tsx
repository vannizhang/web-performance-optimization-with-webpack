import React, { useEffect, useState } from 'react'

import MyWorker from 'worker-loader!./worker'

const worker = new MyWorker()

const n = 1e6

const WebWorkerExample = () => {
    const [count, setCount] = useState<number>()

    const getCountOfPrimeNumbers = async () => {
        worker.addEventListener(
            'message',
            function (e) {
                setCount(e.data.message)
            },
            false
        )

        worker.postMessage(n)
    }

    return (
        <div>
            {count === undefined ? (
                <button onClick={getCountOfPrimeNumbers}>
                    click to do get count of prime numbers less than 1,000,000
                </button>
            ) : (
                <p>{count} prime numbers found</p>
            )}
        </div>
    )
}

export default WebWorkerExample
