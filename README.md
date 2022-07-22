# Web performance optimization with Webpack

## Summary

## Contents
- [HTML](#html)
    - [Minified HTML](#minified-html)
- [CSS](#css)
    - [Extracts CSS](#extracts-css)
    - [Minified CSS](#minified-css)
    - [Inline Critical CSS](#inline-critical-css)
- [Images](#images)
    - [Compress images](#compress-images)
    - [Use WebP Images](#use-webp-images)
    - [Preload and prefetch images](#preload-and-prefetch-images)
    - [Lazy loading images](#lazy-loading-images)
    <!---
    - [Serve responsive images](#serve-responsive-images-not-finished)
    -->
- [JavaScript](#javascript)
    - [Split chunks](#split-chunks)
    - [Minified JS](#minified-js)
    - [Lazy Loading JS](#lazy-loading-js)
    - [Use web worker](#use-web-worker)
- [Fonts](#fonts)
    <!---
    - [Preconnect to load fonts faster](#preconnect-to-load-fonts-faster)
    -->
    - [Cache font resources](#cache-font-resources)
- [Caching](#caching)
    - [Use `[contenthash]` in output filenames](#use-contenthash-in-output-filenames)
- [Others](#others)
    - [Compress text files](#compress-text-files)

## HTML

### Minified HTML 
Minify the HTML by removing unnecessary spaces, comments and attributes to reduce the size of output HTML file and speed up load times.

The [`HtmlWebpackPlugin`](https://webpack.js.org/plugins/html-webpack-plugin/) has the [`minify`](https://github.com/jantimon/html-webpack-plugin#minification) option to control how the output html shoud be minified:

[`webpack.config.js`](./webpack/prod.config.js)
```js
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    //...
    plugins: [
        new HtmlWebpackPlugin({
            ...
            minify: {
                html5                          : true,
                collapseWhitespace             : true,
                minifyCSS                      : true,
                minifyJS                       : true,
                minifyURLs                     : false,
                removeComments                 : true,
                removeEmptyAttributes          : true,
                removeOptionalTags             : true,
                // Remove attributes when value matches default.
                removeRedundantAttributes      : true,
                // Remove type="text/javascript" from script tags. 
                // Other type attribute values are left intact
                removeScriptTypeAttributes     : true,
                // Remove type="text/css" from style and link tags. 
                // Other type attribute values are left intact
                removeStyleLinkTypeAttributese : true,
                // Replaces the doctype with the short (HTML5) doctype
                useShortDoctype                : true
            }
        })
    ]
}
```

## CSS

### Extracts CSS
The extracted css stylesheets can be cached separately. Therefore if your app code changes, the browser only needs to fetch the JS files that changed.

Use [`MiniCssExtractPlugin`](https://webpack.js.org/plugins/mini-css-extract-plugin/) to extract CSS into separate files:

[`webpack.config.js`](./webpack/prod.config.js)
```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    //...
    module: {
        rules: [
            //...
            {
                test: /\.css$/i,
                include: path.resolve(__dirname, '..', 'src'),
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader", options: {
                            sourceMap: true
                        }
                    }, 
                    {
                        loader: 'postcss-loader'
                    }
                ],
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        }),
    ]
}
```

### Minify CSS

Remove unnecessary characters, such as comments, whitespaces, and indentation to reduce the size of output CSS files and speed up how long it takes for the browser to download and execute it.

Use the [`css-minimizer-webpack-plugin`](https://webpack.js.org/plugins/css-minimizer-webpack-plugin/) to optimize and minify the output CSS.

[`webpack.config.js`](./webpack/prod.config.js)
```js
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
    //...
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
        ],
    },
};
```

### Inline Critical CSS
Inlining extracted CSS for critical (above-the-fold) content in the `<head>` of the HTML document eliminates the need to make an additional request to fetch these styles, which can help to speed up render times.

Use the [`html-critical-webpack-plugin`](https://github.com/anthonygore/html-critical-webpack-plugin) to extracts, minifies and inlines above-the-fold CSS.

[`webpack.config.js`](./webpack/prod.config.js)
```js
const HtmlCriticalPlugin = require("html-critical-webpack-plugin");

module.exports = {
    //...
    plugins: [
        new HtmlWebpackPlugin({ ... }),
        new MiniCssExtractPlugin({ ... }),
        new HtmlCriticalPlugin({
            base: path.join(path.resolve(__dirname), '..', 'dist/'),
            src: 'index.html',
            dest: 'index.html',
            inline: true,
            minify: true,
            extract: true,
            width: 1400,
            height: 900,
            penthouse: {
                blockJSRequests: false,
            }
        }),
    ]
}
```

## Images
According to [Ilya Grigorik](https://www.igvita.com/):
> Images often account for most of the downloaded bytes on a web page and also often occupy a significant amount of visual space. As a result, optimizing images can often yield some of the largest byte savings and performance improvements for your website. [More details](https://web.dev/compress-images/)

### Compress images

Use [`image-webpack-loader`](https://github.com/tcoopman/image-webpack-loader) to minify PNG, JPEG, GIF, SVG and WEBP images with [`imagemin`](https://github.com/imagemin/imagemin).

[`webpack.config.js`](./webpack/prod.config.js)
```js
module.exports = {
    //...
    module: {
        rules: [
            //...
            { 
                test: /\.(png|jpg|gif|svg|webp)$/,  
                use : [
                    {
                        loader: "file-loader"
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 50,
                            },
                            pngquant: {
                                quality: [0.5, 0.5]
                            },
                        }
                    }
                ]
            }
        ]
    }
}
```

### Use WebP Images
WebP images are smaller than their JPEG and PNG counterparts - usually on the magnitude of a 25–35% reduction in filesize. This decreases page sizes and improves performance. [More details](https://web.dev/serve-images-webp/)

Use `imagemin` and  `imagemin-webp` to convert images to WebP, here is a script that converts all JPEG and PNG images in the `./src/static/images` folder to WebP:

[convert2webp.js](./scripts/convert2webp.js)
```js
const path = require('path');
const imageFolder = path.join(__dirname, '..', 'src', 'static', 'images')
const { promises } = require('node:fs')
const { promisify } = require('node:util')
const fs = require('graceful-fs');

const fsPromises = promises;
const writeFile = promisify(fs.writeFile);

const move2originalDir = async(files)=>{

    for(const file of files){
        const currDestinationPath = file.destinationPath.replace(/\\/g, '/');

        const source = path.parse(file.sourcePath);
        const destination = path.parse(currDestinationPath);
        const newDestinationPath = `${source.dir}/${destination.name}${destination.ext}`;

        // console.log(currDestinationPath, newDestinationPath)

        if(currDestinationPath === newDestinationPath){
            continue
        }

        await fsPromises.mkdir(path.dirname(newDestinationPath), { recursive: true });

        // save a webp file in the original directory
        await writeFile(newDestinationPath, file.data);

        // remove the original webp file because it's no longer needed
        await fsPromises.unlink(currDestinationPath)
    }
}

const run = async () => {
    const imagemin = (await import("imagemin")).default;
    const webp = (await import("imagemin-webp")).default;

    const processedPNGs = await imagemin([`${imageFolder}/**/*.png`], {
        destination: imageFolder,
        preserveDirectories: true,
        plugins: [
            webp({
                lossless: true,
            }),
        ],
    });

    await move2originalDir(processedPNGs)
    console.log("PNGs processed");

    const processedJPGs = await imagemin([`${imageFolder}/**/*.{jpg,jpeg}`], {
        destination: imageFolder,
        preserveDirectories: true,
        plugins: [
            webp({
                quality: 65,
            }),
        ],
    });

    await move2originalDir(processedJPGs)
    console.log("JPGs and JPEGs processed");
}

run();
```

Modify `"scripts"` section in `package.json` to add `"pre"` scripts, so npm can automatically run `convert2webp` before `npm run build` or `npm run start`.
```js
{
    //...
    "scripts": {
        "convert2webp": "node ./scripts/convert2webp.js",
        "prestart": "npm run convert2webp",
        "start": "webpack serve --mode development --open --config webpack/dev.config.js",
        "prebuild": "npm run convert2webp",
        "build": "webpack --mode production --config webpack/prod.config.js"
    },
}
```

Here is an example of serving WebP images to WebP to newer browsers and a fallback image to older browsers:
```js
import React from 'react'
import nightSkyWebP from '../../static/images/night-sky.webp'
import nightSkyJPG from '../../static/images/night-sky.jpg'

const WebpImage = () => {
    return (
        <picture>
            <source type="image/webp" srcSet={nightSkyWebP} />
            <source type="image/jpeg" srcSet={nightSkyJPG} />
            <img src={nightSkyJPG} alt="" width={500}/>
        </picture>
    )
}

export default WebpImage
```

### Preload and prefetch images

Preload lets you tell the browser about critical resources that you want to load as soon as possible, before they are discovered in HTML, CSS or JavaScript files. This is especially useful for resources that are critical but not easily discoverable, such as banner images included in JavaScript or CSS file.

Use [`@vue/preload-webpack-plugin`](https://github.com/vuejs/preload-webpack-plugin) to automatically inject resource hints tags `<link rel='preload'>` or `<link rel='prefetch'>` into the document `<head>`.

It's important to use `<link rel='preload'>` **sparingly** and only preload the **most critical** resources. 

To do this, we can keep all images that need to be preloaded in the `./src/static/images/preload` folder, then modify `file-loader` to add prefix `"preload."` to the output name for the images in this folder, after that, we can set `fileWhitelist` option of `preload-webpack-plugin` to only inject `<link rel='preload'>` for images with `"preload."` prefix in their names.

and we can repeat the step above to inject `<link rel='prefetch'>` for images that are less important but will very likely be needed later. 

[`webpack.config.js`](./webpack/prod.config.js)
```js
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');

module.exports = {
    //...
    module: {
        rules: [
            { 
                test: /\.(png|jpg|gif|svg|webp)$/,  
                use : [
                    {
                        loader: "file-loader",
                        options: {
                            name(resourcePath, resourceQuery){

                                // add "preload." prefix to images in preload folder
                                if(resourcePath.includes('preload')){
                                    return 'preload.[contenthash].[ext]';
                                } 
                                
                                // add "prefetch." prefix to images in prefetch folder
                                if (resourcePath.includes('prefetch')){
                                    return 'prefetch.[contenthash].[ext]';
                                }

                                return '[contenthash].[ext]';
                            },
                        }
                    }
                ]
            },
        ]
    },
    plugins: [
        new PreloadWebpackPlugin({
            rel: 'preload',
            as(entry) {
                if (/\.(png|jpg|gif|svg|webp)$/.test(entry)) {
                    return 'image';
                }
            },
            // only inject `<link rel='preload'>` for images with `"preload."` prefix in their names
            fileWhitelist: [
                /preload.*\.(png|jpg|gif|svg|webp)$/
            ],
            include: 'allAssets'
        }),
        new PreloadWebpackPlugin({
            rel: 'prefetch',
            as(entry) {
                if (/\.(png|jpg|gif|svg|webp)$/.test(entry)) {
                    return 'image';
                }
            },
            // only inject `<link rel='prefetch'>` for images with `"prefetch."` prefix in their names
            fileWhitelist: [
                /prefetch.*\.(png|jpg|gif|svg|webp)$/
            ],
            include: 'allAssets'
        }),
    ]
}
```

### Lazy loading images
Lazy load offscreen images will improve the response time of the current page and then avoid loading unnecessary images that the user may not need.

Fortunately we don't need to tune webpack to enable lazy load image, just use browser-level lazy-loading with the `loading` attribute, use `lazy` as the value to tell the browser to load the image immediately if it is in the viewport, and to fetch other images when the user scrolls near them.

You can also use `Intersection Observer` or `event handlers` to polyfill lazy-loading of `<img>`: [more details](https://web.dev/lazy-loading-images/#images-inline-intersection-observer)

Here is an example of `<img>` with `loading="lazy"`:
```html
<img src="image.png" loading="lazy" alt="…" width="200" height="200">
<picture>
    <source media="(min-width: 800px)" srcset="large.jpg 1x, larger.jpg 2x">
    <img src="photo.jpg" loading="lazy">
</picture>
```

<!---
###  Serve responsive images (not finished)
According to [this article](https://web.dev/serve-responsive-images/):
> Serving desktop-sized images to mobile devices can use 2–4x more data than needed. Instead of a "one-size-fits-all" approach to images, serve different image sizes to different devices.

It seems [`responsive-loader`](https://github.com/dazuaz/responsive-loader) can be a good tool to use but I encountered error when using it with TypeScipt. 
-->

## JavaScript
### Split chunks
Code split vendors (dependencies) into a separate bundle to improve caching. Our application code changes more often than the vendor code because we adjust versions of your dependencies less frequently. Split vendor bundles allows the broswer to continue using cached vendor bundle as long as it's not change.

Use out of the box `SplitChunksPlugin` to split chunks, and we tune the [`optimization.splitChunks`](https://webpack.js.org/plugins/split-chunks-plugin/#optimizationsplitchunks) configuration to split vendor bundles.

[`webpack.config.js`](./webpack/prod.config.js)
```js
module.exports = {
    //...
    optimization: {
        splitChunks: {
            cacheGroups: {
                // vendor chunk
                vendor: {
                    // sync + async chunks
                    chunks: 'all',
                    name: 'vendor',
                    // import file path containing node_modules
                    test: /node_modules/
                }
            }
        },
    }
}
```

### Minified JS
Like HTML and CSS files, removing all unnecessary spaces, comments and break will reduce the size of your JavaScript files and speed up your site's page load times. 

Use [`TerserWebpackPlugin`](https://webpack.js.org/plugins/terser-webpack-plugin/) to minify/minimize the output JavaScript files:

[`webpack.config.js`](./webpack/prod.config.js)
```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    //...
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: true,
                terserOptions: {
                    compress: {
                        drop_console: true,
                    }
                }
            }), 
        ],
    },
};
```

### Lazy loading JS
Split the non-critical codes into its own bundle and reduce the size of initial bundle can make the initial load faster. Then dynamically import these non-critical codes on demand.

Use `react.lazy` to dynamic import a component. The components or modules that we know are likely to be used at some point in the application can be prefetched, according to [this ariticle](https://www.patterns.dev/posts/prefetch/):

> Modules that are prefetched are requested and loaded by the browser even before the user requested the resource. When the browser is idle and calculates that it's got enough bandwidth, it will make a request in order to load the resource, and cache it. Having the resource cached can reduce the loading time significantly.

We can let Webpack know that certain bundles need to be prefetched, by adding a magic comment to the import statement: `/* webpackPrefetch: true */`.

here is an example of lazy loading a [React component](./src/components/LazyLoadComponent/EmojiPicker.tsx)
```js
import React, { Suspense, lazy, useState, useEffect } from "react";

const EmojiPicker = lazy(()=>import(
    /* webpackPrefetch: true */ 
    /* webpackChunkName: "emoji-picker" */
    "./EmojiPicker"
))

const ChatInput = () => {
    const [ showEmojiPicker, setShowEmojiPicker ] = useState(false)

    return (
        <div>
            <div>
                <input type="text" placeholder="Type a message..." />
                <button onClick={setShowEmojiPicker.bind(null, true)}>pick emojis</button>
            </div>
            
            <Suspense fallback={<span id="loading">Loading...</span>}>
                { showEmojiPicker && <EmojiPicker /> }
            </Suspense>
        </div>
    )
}

export default ChatInput
```

Here is an example of lazy loading a [module](./src/utils/numbers.ts):
```js
import React, { useState } from 'react'

const RandomNumberCard = () => {

    const [ randomNum, setRandomNum ] = useState<number>()

    const getRandomNum = async()=>{

        // load numbers module dynamically
        const { generateRandomNumber } = await import(
            '../../utils/numbers'
        )
        setRandomNum(generateRandomNumber(50, 100))
    }

    return (
        <div>
            <button onClick={getRandomNum}> get a random number </button>
            { randomNum !== undefined && <span> { randomNum } </span> }
        </div>
    )
}

export default RandomNumberCard
```

### Use web worker
JavaScript runs on the browser’s main thread, right alongside style calculations, layout, and, in many cases, paint. If your JavaScript runs for a long time, it will block these other tasks, potentially causing frames to be missed. Move pure computational work (code doesn’t require DOM access) to Web Workers and run it off the browser's main thread can thus improve the rendering performance significantly.

Use worker loader to load web worker file, and communicate with the web worker by sending messages via the postMessage API:

Here is an example of using web worker in a [React Component](./src/components/WebWorker/WebWorkerExample.tsx):

```js
import React, { useEffect, useState } from 'react';

// load web worker
import MyWorker from 'worker-loader!./worker';

const n = 1e6;

const WebWorkerExample = () => {
    const [ count, setCount ] = useState<number>()

    const getCountOfPrimeNumbers = async ()=> {

        // create a web worker
        const worker = new MyWorker();

        // add message event listener to receive message returned by web worker
        worker.addEventListener(
            'message',
            function (e) {
                setCount(e.data.message);
            },
            false
        );

        // post message and have the web woker start doing geavy tasks in a separate thread
        worker.postMessage(n);
    };

    return (
        <div>
            { count === undefined 
                ? <button onClick={getCountOfPrimeNumbers}>get count</button>
                : <p>{count} prime numbers found</p>
            }
        </div>
        
    );
};

export default WebWorkerExample;
```


here is the [worker.ts](./src/components/WebWorker/worker.ts):
```js
const ctx: Worker = self as any;

// receive message from the main thread
ctx.onmessage = async (e) => {

    if(!e.data){
        return 0
    }

    let count = 0;

    // codes that get count of primes that can take long time to run...

    // send message back to the main thred
    ctx.postMessage({ message: count });
};
```

<!--
### tree shaking
-->

## Fonts
<!--
### Preconnect to load fonts faster:
If the site loads fonts from a third-party site, use the preconnect resource hint to establish early connection(s) with the third-party origin.

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackPreconnectPlugin = require('html-webpack-preconnect-plugin');

module.exports = {
    //...
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            //...
            preconnect: [
                'https://fonts.googleapis.com',
                'https://fonts.gstatic.com'
            ]
        }),
        // enabled preconnect plugin
        new HtmlWebpackPreconnectPlugin(),
    ]
}
```
-->

### Cache font resources
Font resources are, typically, static resources that don't see frequent updates. As a result, they are ideally suited for a long max-age expiry. 

In addition to the browser cache, using service worker to serve font resources with a cache-first strategy is appropriate for most use cases:

[sw.js](./src/serviceWorker/sw.js)
```js
//...
self.addEventListener('fetch', (event)=>{
    
    // Let the browser do its default thing
    // for non-GET requests.
    if (event.request.method != "GET") {
        return;
    };

    // Check if this is a request for a font file
    if (event.request.destination === 'font') {

        // console.log('service worker fetching', event.request)
        event.respondWith(caches.open(cacheName).then((cache) => {
            // Go to the cache first
            return cache.match(event.request.url).then((cachedResponse) => {
                // Return a cached response if we have one
                if (cachedResponse) {
                    return cachedResponse;
                }

                // Otherwise, hit the network
                return fetch(event.request).then((fetchedResponse) => {
                    // Add the network response to the cache for later visits
                    cache.put(event.request, fetchedResponse.clone());

                    // Return the network response
                    return fetchedResponse;
                });
            });
        }));

    } else {
        return;
    }
})
```

## Caching
### Use contenthash in output filenames

We always want to have our static files be cahced by the browser with a long expiry time to improve the load speed. However, everytime when we make a change to our static files, we will want to make sure the browser can get the latest version of that file instead of retrieving the old one from the cache.

This can be achieved by adding `[contenthash]` to the output filenames, `[contenthash]` is unique hash based on the content of an asset. When the asset's content changes, `[contenthash]` will change as well.

[`webpack.config.js`](./webpack/prod.config.js)
```js
module.exports = {
    //...
    output: {
        path: path.resolve(__dirname, '..', './dist'),
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].js',
        clean: true
    }
}
```

<!--
## service worker
### cache strategy
- cache fonts and other static files
according to https://developer.chrome.com/docs/workbox/caching-strategies-overview/, **Cache first, falling back to network** is a great strategy to apply to all static assets (such as CSS, JavaScript, images, and fonts), especially hash-versioned ones. It offers a speed boost for immutable assets by side-stepping any content freshness checks with the server the HTTP cache may kick off. More importantly, any cached assets will be available offline.

https://developer.chrome.com/docs/workbox/using-workbox-without-precaching/#webpack
-->

## Others

### Compress text files
Compress text files and reduce the size of these files can improve load speed, normally, this is handled by a server like Apache or Nginx on runtime, but you might want to pre-build compressed assets to save the runtime cost. 

Use [`CompressionWebpackPlugin`](https://webpack.js.org/plugins/compression-webpack-plugin/) to prepare compressed versions of assets.

```js
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
    //...
    plugins: [
        new CompressionPlugin()
    ]
};
```
<!--
### preconnect, and dns-prefecting
-->

## Resources
- [Fast load times](https://web.dev/fast/)
- [Front-End Performance Checklist](https://github.com/thedaviddias/Front-End-Performance-Checklist)
- [Awesome Webpack Perf ](https://github.com/iamakulov/awesome-webpack-perf)
- [Critical CSS and Webpack: Automatically Minimize Render-Blocking CSS](https://vuejsdevelopers.com/2017/07/24/critical-css-webpack/)
- [Webpack - How to convert jpg/png to webp via image-webpack-loader](https://stackoverflow.com/questions/58827843/webpack-how-to-convert-jpg-png-to-webp-via-image-webpack-loader)
- [Best practices for fonts](https://web.dev/font-best-practices/)

## Contribute
Please feel free to open an issue or a pull request to suggest changes, improvements or fixes.

## License
[MIT](./LICENSE)