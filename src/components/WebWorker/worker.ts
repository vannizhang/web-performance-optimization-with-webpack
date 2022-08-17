const ctx: Worker = self as any

const countPrimes = function (n: number) {
    if (n <= 1) {
        return 0
    }

    const dp = new Array(n).fill(true)

    for (let num = 2; num < Math.sqrt(n); num++) {
        if (dp[num] === false) {
            continue
        }

        for (let i = num * num; i < n; i += num) {
            dp[i] = false
        }
    }

    let count = 0

    for (let i = 2; i < n; i++) {
        if (dp[i] === true) {
            count++
        }
    }

    return count
}

ctx.onmessage = async (e) => {
    if (!e.data) {
        return 0
    }

    const count = countPrimes(e.data)
    ctx.postMessage({ message: count })
}

// ctx.addEventListener('message', )
