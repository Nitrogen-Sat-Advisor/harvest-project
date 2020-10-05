const Webpack = require('webpack')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const webpackMerge = require('webpack-merge')

const commonConfig = require('./webpack.config.common')

module.exports = webpackMerge.merge(commonConfig, {
    mode: 'production',

    devtool: 'source-map',

    optimization: {
        minimize: true
    },

    plugins: [
        new Webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new OptimizeCssAssetsPlugin()
    ]
})
