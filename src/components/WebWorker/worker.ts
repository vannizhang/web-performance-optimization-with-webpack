const ctx: Worker = self as any;

ctx.onmessage = async (e) => {
    console.log(e);

    console.log('Worker is about to start some work');

    let count = 0;

    for (let i = 0; i <= e.data; i++) {
        if (i % 791 === 0) {
            count++;
        }
    }

    ctx.postMessage({ message: count });
};

// ctx.addEventListener('message', )
