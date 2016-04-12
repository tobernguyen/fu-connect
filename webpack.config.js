var path = require('path');
var webpack = require('webpack');
var pkg = require('./package.json');
var merge = require('webpack-merge');
var TARGET = process.env.npm_lifecycle_event;
process.env.BABEL_ENV = TARGET;

var ROOT_PATH = path.resolve(__dirname);
var BUILD_PATH = path.resolve(ROOT_PATH, 'dist', 'build');

var common = {
  entry: {
      options: "./src/options.js",
      login_page: "./src/login_page/login_page.js",
      content_script: "./src/content_script.js",
      background: "./src/background.js"
  },
  output: {
      path: __dirname + "/dist/unpacked/",
      filename: "[name].js"
  },
  module: {
      loaders: [
          { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader", query: {stage: 0}},
          { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff' },
          { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
          {
            test: /\.(png|jpg|gif)$/,
            loader: 'url-loader?limit=10000'
          },
          { test: require.resolve('jquery'), loader: 'expose?$' },
          {
            test: /\.css$/,
            loaders: ['style', 'css']
          },
          {
            test: /\.scss$/,
            loaders: ["style", "css", "sass"]
          }
      ]
  }
}

var productionConfig = {
  output: {
      path: BUILD_PATH,
      filename: '[name].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        // This affects react lib size
        'NODE_ENV': JSON.stringify('production')
      },
      __PRODUCTION__: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true
      }
    })
  ]
}

if (TARGET === 'build') {
  module.exports = merge(common, productionConfig);
} else {
  module.exports = merge(common, {
    devtool: 'eval-source-map'
  });
}
