/* eslint-disable @typescript-eslint/no-var-requires */
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

module.exports = {
    target: "web",
    context: path.resolve(__dirname, ""),
    entry: {
        chill: "./src/chill.ts"
    },
    output: {
        filename: "js/[name].min.js",
        chunkFilename: "js/[name].bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    resolve: {
        extensions: [".ts", ".js"],
        modules: ["node_modules"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    {loader: "style-loader"},
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            ident: "postcss",
                            plugins: [
                                require("cssnano")()
                            ]
                        }
                    }
                ],
                exclude: /node_modules/

            },
            {
                test: /\.(otf|woff)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                        outputPath: "resources/fonts"
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.svg$/,
                oneOf: [
                    {
                        include: path.resolve(__dirname, "resources/images/daily-jackpot/import/"),
                        use: "svg-inline-loader"
                    },
                    {
                        exclude: path.resolve(__dirname, "resources/images/daily-jackpot/import/"),
                        use: "svg-url-loader"
                    },
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                use: "url-loader",
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                use: {
                    loader: "image-webpack-loader",
                    options: {
                        svgo: {
                            plugins: [
                                // use these settings for internet explorer for proper scalable SVGs
                                // https://css-tricks.com/scale-svg/
                                {removeViewBox: false},
                                {removeDimensions: true}
                            ]
                        }
                    }
                },
                // This will apply the loader before the other ones
                enforce: "pre",
            },
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            Promise: "es6-promise"
        }),
        new CopyPlugin([
            {from: "resources/brand", to: "resources/brand"}, //legacy, please don't remove. some games have this
            {from: "resources/config", to: "resources/config"},
            {from: "resources/autoplay.webm", to: "resources/autoplay.webm"},
            {from: "libs/howler.min.js", to: "js/howler.min.js"},
        ]),
    ],
};