module.exports = {
    devtool: 'eval-source-map',
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true
    },
    entry: {
        options: "./src/options.js",
        login_page: "./src/login_page/login_page.js",
        content_script: "./src/content_script.js",
        event_page: "./src/event_page.js"
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
              test: /\.css$/,
              loaders: ['style', 'css']
            },
            {
              test: /\.scss$/,
              loaders: ["style", "css", "sass"]
            },
            {
              test: /\.(png|jpg|gif)$/,
              loader: 'url-loader?limit=10000&name=img/img-[hash:6].[ext]'
            },
            { test: require.resolve('jquery'), loader: 'expose?$' }
        ]
    }
};
