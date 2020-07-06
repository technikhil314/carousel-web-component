const path = require("path");
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: process.env.WEBPACK_DEV_SERVER ? "development" : "production",
    entry: "./index.js",
    output: {
        filename: 'index.min.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.scss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                        },
                    },
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'index.js', to: 'index.js' },
                { from: 'styles.scss', to: 'styles.scss' }
            ],
        }),
        new HtmlWebpackPlugin({
            template: "./index.html",
            minify: true
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.css',
        })
    ],
    devtool: 'source-map',
    devServer: {
        port: 3000
    }
}