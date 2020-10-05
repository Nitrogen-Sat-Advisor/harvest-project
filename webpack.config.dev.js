const Webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const webpackMerge = require('webpack-merge')

const commonConfig = require('./webpack.config.common')

module.exports = webpackMerge.merge(commonConfig, {
    mode: 'development',

    devtool: 'cheap-module-source-map',

    devServer: {
        hot: true,
        host: '0.0.0.0',
        port: 5000,
        inline: true,
        stats: ['minimal', 'color'],
        historyApiFallback: true,
        allowedHosts: JSON.parse(process.env.ALLOWED_HOSTS || '["localhost"]'),
        headers: { 'Access-Control-Allow-Origin': '*' }
    },

    plugins: [
        new Webpack.DefinePlugin({
            'process.env.NODE_ENV': '"development"'
        }),
        new BundleAnalyzerPlugin({ openAnalyzer: false, analyzerPort: 5050 })
    ]
})
