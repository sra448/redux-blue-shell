module.exports = [
  {
    entry: {
      "redux-simple-app": "./src/index.js"
    },
    output: {
      path: __dirname,
      filename: "./build/[name].js"
    },
    module: {
      loaders: [{ test: /\.js$/, loader: "babel-loader" }]
    }
  }
];
