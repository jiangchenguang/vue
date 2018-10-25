const path = require("path");

module.exports = {
  devtool: "eval-source-map",
  module : {
    rules: [
      {
        test   : /\.tsx?$/,
        use    : "ts-loader",
        exclude: /node_modules/
      },
      {
        test   : /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use    : {
          loader : "babel-loader",
          options: {
            presets: [ "@babel/preset-env" ]
          }
        }
      }
    ]
  },
  resolve: {
    extensions: [ ".tsx", ".ts", ".js" ],
    alias     : {
      "src"  : path.resolve(__dirname, "../src"),
      "types": path.resolve(__dirname, "../types")
    },
  }
};
