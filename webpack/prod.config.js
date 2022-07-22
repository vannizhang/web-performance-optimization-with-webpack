const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlCriticalPlugin = require("html-critical-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');
const HtmlWebpackPreconnectPlugin = require('html-webpack-preconnect-plugin');

module.exports =  (env, options)=> {

    const devMode = options.mode === 'development' 
        ? true 
        : false;

    process.env.NODE_ENV = options.mode;

    return {
        mode: options.mode,
        entry: {
            main: path.resolve(__dirname, '..', './src/index.tsx'),
            sw: path.resolve(__dirname, '..', './src/serviceWorker/sw.js'),
        },
        output: {
            path: path.resolve(__dirname, '..', './dist'),
            filename: ({runtime}) => {
                // Check if the current filename is for the service worker:
                if (runtime === 'sw') {
                    // Output a service worker in the root of the dist directory
                    // Also, ensure the output file name doesn't have a hash in it
                    return '[name].js';
                }
        
                // Otherwise, output files as normal
                return '[name].[contenthash].js';
            },
            chunkFilename: '[name].[contenthash].js',
            clean: true
        },
        devtool: 'source-map',
        resolve: {
            extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    loader: 'babel-loader',
                },
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
                },
                { 
                    test: /\.(woff|woff2|ttf|eot)$/,  
                    loader: "file-loader",
                    options: {
                        name: '[name].[contenthash].[ext]',
                    }
                },
                { 
                    test: /\.(png|jpg|gif|svg|webp)$/,  
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
                                }
                            }
                        }
                    ]
                },
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].[contenthash].css',
                chunkFilename: '[name].[contenthash].css'
            }),
            new HtmlWebpackPlugin({
                // inject: false,
                // hash: true,
                template: path.resolve(__dirname, '..', './public/index.html'),
                filename: 'index.html',
                chunks: ['main'],
                minify: {
                    html5                          : true,
                    collapseWhitespace             : true,
                    minifyCSS                      : true,
                    minifyJS                       : true,
                    minifyURLs                     : false,
                    removeComments                 : true,
                    removeEmptyAttributes          : true,
                    removeOptionalTags             : true,
                    removeRedundantAttributes      : true,
                    removeScriptTypeAttributes     : true,
                    removeStyleLinkTypeAttributese : true,
                    useShortDoctype                : true
                },
                preconnect: [
                    // 'https://fonts.googleapis.com',
                ]
            }),
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
            new PreloadWebpackPlugin({
                rel: 'preload',
                as(entry) {
                    if (/\.(png|jpg|gif|svg|webp)$/.test(entry)) {
                        return 'image';
                    }
                },
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
                fileWhitelist: [
                    /prefetch.*\.(png|jpg|gif|svg|webp)$/
                ],
                include: 'allAssets'
            }),
            new HtmlWebpackPreconnectPlugin(),
            new CompressionPlugin()
        ],
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
            // Tell webpack to minimize the bundle using the TerserPlugin
            minimize: true,
            minimizer: [
                new CssMinimizerPlugin(),
                new TerserPlugin({
                    extractComments: true,
                    terserOptions: {
                        compress: {
                            drop_console: true,
                        }
                    }
                })
            ],
        }
    } 

};