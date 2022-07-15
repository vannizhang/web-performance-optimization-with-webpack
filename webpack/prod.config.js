const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
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
        entry: path.resolve(__dirname, '..', './src/index.tsx'),
        output: {
            path: path.resolve(__dirname, '..', './dist'),
            filename: '[name].[contenthash].js',
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
                        },
                        {
                            loader: 'image-webpack-loader',
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
                    'https://webapps-cdn.esri.com'
                ]
            }),
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
                include: 'allAssets'
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
            minimize: true,
            minimizer: [
                new CssMinimizerPlugin(),
                new TerserPlugin({
                    extractComments: true,
                    terserOptions: {
                        compress: {
                            drop_console: true,
                        },
                        mangle: true
                    }
                }), 
            ],
        }
    } 

};