## How to use Web Worker with TypeScript and Webpack?

This [issue](https://github.com/webpack-contrib/worker-loader/issues/189) provides detailed explaination:

1. install `worker-loader`
    ```
    npm install worker-loader --save-dev
    ```

2. added below to `custom.d.ts`:
    ```js
    declare module "worker-loader!*" {
        class WebpackWorker extends Worker {
            constructor();
        }

        export default WebpackWorker;
    }
    ```

3. create `worker.js`:
    ```js
    const ctx: Worker = self as any;

    ctx.onmessage = async(e) => {
        console.log(e)

        console.log('Worker is about to start some work');

        let count: number = 0;

        for (let i: number = 0; i <= e.data; i++) {
            if(i % 791 === 0){
                count++
            }
        }

        ctx.postMessage({ message: count });
    }

    // ctx.addEventListener('message', )
    ```
    
4. import and use it:
    ```js
    import MyWorker from 'worker-loader!./worker'

    const worker = new MyWorker()

    worker.addEventListener('message', function (e) {
        
        console.log(e.data);
    }, false);

    worker.postMessage(1e7);
    ```

