const common = require("./webpack.common.js");
const merge = require("webpack-merge");

const TerserPlugin = require("terser-webpack-plugin");
const domProps = require("uglify-js/tools/domprops");

const webpack = require("webpack");

module.exports = merge(common, {
    mode: "production",
    optimization: {
        moduleIds: "total-size",
        mangleWasmImports: true,
        minimizer: [
            new TerserPlugin({
                sourceMap: true,
                terserOptions: {
                    ecma: 5,
                    mangle: {
                        properties: {
                            builtins: false,
                            keep_quoted: true,
                            reserved: ["attributes", "childList", "characterData"].concat(domProps)
                        }
                    }
                }

            }),
        ]
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: "[file].map",
            //publicPath: "https://10.105.12.73/out/js/"
        })
    ]
});