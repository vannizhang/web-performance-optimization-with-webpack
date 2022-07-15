const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports =  {
    mode: 'development',
    entry: path.resolve(__dirname, '..', './src/index.tsx'),
    output: {
        path: path.resolve(__dirname, '..', './dist'),
        filename: '[name].js',
        chunkFilename: '[name].js',
    },
    devtool: 'inline-source-map',
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
                loader: "file-loader"
            },
            { 
                test: /\.(png|jpg|gif|svg)$/,  
                loader: "file-loader"
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '..', './public/index.html'),
            filename: 'index.html'
        })
    ]
};