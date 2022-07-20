# front-end-performance-tips

## HTML
- Minified HTML 
    - Why: Removing all unnecessary spaces, comments and attributes will reduce the size of your HTML and speed up your site's page load times and obviously lighten the download for your user.
    - How: the HtmlWebpackPlugin has the minify option to control how the output html shoud be minified
        ```js
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
                        // Remove type="text/javascript" from script tags. Other type attribute values are left intact
                        removeScriptTypeAttributes     : true,
                        // Remove type="text/css" from style and link tags. Other type attribute values are left intact
                        removeStyleLinkTypeAttributese : true,
                        // Replaces the doctype with the short (HTML5) doctype
                        useShortDoctype                : true
                    }
                })
            ]
        }
        ```

## CSS
- extracts CSS into separate files

    ```js
    module.exports = {
        //...
        module: {
            rules: [
                //...
                {
                    test: /\.css$/i,
                    include: path.resolve(__dirname, 'src'),
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader", 
                            options: {
                                sourceMap: true
                            }
                        }, 
                        {
                            loader: 'postcss-loader'
                        }
                    ],
                },

            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].[contenthash].css'
            }),
        ]
    }
    ```

- Minify CSS: All CSS files are minified, comments, white spaces and new lines are removed from production files.
    - how: To minify the output, use a plugin like `css-minimizer-webpack-plugin`
    ```js
    module.exports = {
        //...
        optimization: {
            minimizer: [
                new CssMinimizerPlugin(),
            ],
        },
    };
    ```
- Shorten CSS class names vs tailwind.css
- Combine CSS files in a single file (Not needed for HTTP/2)
- Inlining and preload critical CSS (Not needed for HTTP/2)

## Images
- preload critical images and prefetch images that will likely to be used later
    - how: use PreloadWebpackPlugin, what I did here is creating two folders './src/static/images/preload' and  './src/static/images/prefetch' and place the image files into these two folders, and moddify the file-loader to add prefix of 'preload' and 'prefetch to the outout file names, and add regex to the fileWhitelist of  PreloadWebpackPlugin
        ```js
        const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');

        module.exports = {
            //...
            module: {
                rules: [
                    { 
                        test: /\.(png|jpg|gif|svg)$/,  
                        use : [
                            {
                                loader: "file-loader",
                                options: {
                                    name(resourcePath, resourceQuery){

                                        if(resourcePath.includes('preload')){
                                            return 'preload.[contenthash].[ext]';
                                        } 
                                        
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
                        if (/\.(png|jpg|gif|svg)$/.test(entry)) {
                            return 'image';
                        }
                    },
                    fileWhitelist: [
                        /preload.*\.(png|jpg|gif|svg)$/
                    ],
                    include: 'all'
                }),
                new PreloadWebpackPlugin({
                    rel: 'prefetch',
                    as(entry) {
                        if (/\.(png|jpg|gif|svg)$/.test(entry)) {
                            return 'image';
                        }
                    },
                    fileWhitelist: [
                        /prefetch.*\.(png|jpg|gif|svg)$/
                    ],
                    include: 'all'
                }),
            ]
        }
        ```
- minify the image files
    - why
    - how: use `image-webpack-loader` to minify images
    ```js
    module.exports = {
        //...
        module: {
            rules: [
                //...
                { 
                    test: /\.(png|jpg|gif|svg)$/,  
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
- use webp
    why:
    how: according to this stackoverflow post: https://stackoverflow.com/questions/58827843/webpack-how-to-convert-jpg-png-to-webp-via-image-webpack-loader
    1. convert to webp
    ```js
    const outputFolder = "./dist";

    const produceWebP = async () => {
        // Load ESM modules using import(),
        // it returns a Promise which resolves to
        // default export as 'default' and other named exports.
        // In this case we need default export.
        const imagemin = (await import("imagemin")).default;
        const webp = (await import("imagemin-webp")).default;

        await imagemin(["./img/*.png"], {
            destination: outputFolder,
            plugins: [
                webp({
                    lossless: true,
                }),
            ],
        });

        // console.log("PNGs processed");
        await imagemin(["./img/*.{jpg,jpeg}"], {
            destination: './img',
            plugins: [
                webp({
                    quality: 65,
                }),
            ],
        });

        console.log("JPGs and JPEGs processed");
    };

    produceWebP();
    ```

    2. update the package.json to run the script above before start dev server and build
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

    3. use webp
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

- lazy load images
    why: 
    how: https://web.dev/lazy-loading-images/
        - Using browser-level lazy-loading (https://web.dev/browser-level-image-lazy-loading/), recommended 
        ```html
        <img src="image.png" loading="lazy" alt="…" width="200" height="200">
        <picture>
            <source media="(min-width: 800px)" srcset="large.jpg 1x, larger.jpg 2x">
            <img src="photo.jpg" loading="lazy">
        </picture>
        ```
        
- serve responsive images (not finished)
    links: https://web.dev/serve-responsive-images/
    why: Serving desktop-sized images to mobile devices can use 2–4x more data than needed. Instead of a "one-size-fits-all" approach to images, serve different image sizes to different devices.
    how: The sharp package is a good choice for automating image resizing (for example, generating multiple sizes of thumbnails for all the videos on your website).

## JavaScript
- split chunks
    - why: Code split vendors with webpack can help to improve caching: https://blog.jakoblind.no/code-split-vendors-with-webpack-for-faster-load-speed/
    - how: use SplitChunksPlugin to Create a custom vendor chunk, which contains certain node_modules packages matched by RegExp.

        ```js
        module.exports = {
            //...
            optimization: {
                splitChunks: {
                    cacheGroups: {
                        // vendor chunk
                        vendor: {
                            // sync + async chunks
                            idHint: 'vendor',
                            // import file path containing node_modules
                            test: /node_modules/
                        }
                    }
                },
            }
        }
        ```
- minify and mangle output JS
    - why:
    - how: use TerserPlugin
    - references: https://github.com/terser/terser
    
    ```js
    const TerserPlugin = require('terser-webpack-plugin');

    module.exports = {
        //...
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin()
            ],
        },
    };
    ```

- lazy load
    - split the non-critical codes into its own bundle and and reduce the size of initial bundle
    - references: https://www.patterns.dev/posts/dynamic-import/, https://www.patterns.dev/posts/prefetch/
    - how: use react.lazy to dynamic import a component; Components or resources that we know are likely to be used at some point in the application can be prefetched. We can let Webpack know that certain bundles need to be prefetched, by adding a magic comment to the import statement: `/* webpackPrefetch: true */`. 
    - need to resolve: why re-export breaking lazy load

    lazy load a component
    ```js
    import React, { Suspense, lazy, useState } from "react";

    const EmojiPicker = lazy(()=>import(
        /* webpackPrefetch: true */ 
        /* webpackChunkName: "emoji-picker" */
        "../EmojiPicker/EmojiPicker"
    ))

    const TextInput = () => {
        const [ showEmoji, setShowEmoji ] = useState(false)

        return (
            <div>
                <div>
                    <input type="text" />
                    <span onClick={setShowEmoji.bind(null, true)}>show emojis</span>
                </div>
                
                <Suspense fallback={<span id="loading">Loading...</span>}>
                    {showEmoji && <EmojiPicker />}
                </Suspense>
            </div>
        )
    }

    export default TextInput
    ```

    lazy load a module
    ```js
    const showRandomNum = async()=>{
        const { generateRandomNumber } = await import(
            /* webpackPrefetch: true */ 
            '../../utils/numbers'
        )
        setRandomNum(generateRandomNumber(50, 100))
    }

    ```

- tree shaking

- web worker

## Fonts
-  Use preconnect to load your fonts faster:
    - how: 
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
                    'https://webapps-cdn.esri.com'
                ]
            }),
            // enabled preconnect plugin
            new HtmlWebpackPreconnectPlugin(),
        ]
    }
    ```
- If your web application uses a service worker, serving font resources with a cache-first strategy is appropriate for most use cases: https://web.dev/optimize-webfont-loading/#proper-caching-is-a-must

## Server side 
- content hash in output file names
- Improve Website Performance Using gzip: https://www.digitalocean.com/community/tutorials/how-to-improve-website-performance-using-gzip-and-nginx-on-ubuntu-20-04, Normally, this is done by a server like Apache or Nginx on runtime; but you might want to pre-build compressed assets to save the runtime cost. compression-webpack-plugin works for Gzip and Brotli
    - how: 
    ```js
    const CompressionPlugin = require("compression-webpack-plugin");

    module.exports = {
        plugins: [
            new CompressionPlugin()
        ]
    };
    ```
- cache policy
- preconnect