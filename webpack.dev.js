const common = require("./webpack.common.js");
const merge = require("webpack-merge");
const webpack = require("webpack");

module.exports = merge(common, {
    mode: "development",
    devtool: false,
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: "[file].map",
        })
    ],
    watch: true
});