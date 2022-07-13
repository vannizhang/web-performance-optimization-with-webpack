const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports =  (env, options)=> {

    const devMode = options.mode === 'development' 
        ? true 
        : false;
    process.env.NODE_ENV = options.mode;

    return {
        entry: path.resolve(__dirname, './src/index.tsx'),
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: '[name].[contenthash].js',
            chunkFilename: '[name].[contenthash].js',
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
                    include: path.resolve(__dirname, 'src'),
                    use: ['style-loader', 'css-loader', 'postcss-loader'],
                },
                { test: /\.(woff|ttf|eot)$/, loader: "file-loader" },
                { test: /\.(png|jpg|gif|svg)$/,  loader: "file-loader" },
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                // inject: false,
                // hash: true,
                template: './public/index.html',
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
                }
            })
        ],
    }

};