const webpack=require('webpack');
var path = require('path');

var ROOT_PATH = path.resolve(__dirname,'build');

var config = {
    entry: './main.js',

    output: {
        path:ROOT_PATH,
        filename: 'index.js',
    },

    devtool: 'source-map',

    devServer: {
        inline: true,
        port: 8080
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',

                query: {
                    presets: ['latest','react', 'stage-1']
                }
            },
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',

                query: {
                    presets: ['latest','react', 'stage-1']
                }
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                loaders: ['style-loader','css-loader','sass-loader']
            },
            {
                test :/\.(png|jpg|jpeg|gib|woff|woff2|svg|eot|ttf)$/,
                loader :'url-loader'
            }
        ]
    },
    // provide WaveSurfer as a globally accessible variable
    plugins: [
        new webpack.ProvidePlugin({
            WaveSurfer: 'wavesurfer.js'
        })
    ],
    // Alias `wavesurfer` to the correct wavesurfer package.
    // (wavesurfer.js has some non-standard naming convention)
    resolve: {
        alias: {
            wavesurfer: require.resolve('wavesurfer.js')
        }
    }
}

module.exports = config;