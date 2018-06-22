const path = require('path');
// const MODE = 'development';
const MODE = 'production';
const enabledSourceMap = (MODE === 'production');

module.exports = {
  mode: MODE,
  entry: [
    'babel-polyfill',
    './src/index.js'
  ],
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  },
  performance: { hints: false },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [ 'env', { 'modules': false } ]
              ]
            }
          }
        ]
      },
      {
        test: /\.css/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: false,
              sourceMap: enabledSourceMap,
            }
          },
        ],
      },
      {
        test: /\.(gif|png|jpg|eot|wof|woff|woff2|ttf|svg)$/,
        loader: 'url-loader'
      }
    ]
  },
  devServer: {
    contentBase: 'dist',
    open: true,
    hot: true,
  }
};