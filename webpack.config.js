const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: { path: './build', publicPath: '/build/', filename: 'bundle.js' },
  devtool: 'inline-source-map',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      },
      { 
        test: /\.css$/, loader: "style-loader!css-loader" 
      }
    ]
  }
}
