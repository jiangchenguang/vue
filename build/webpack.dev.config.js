const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry  : "./src/entries/web-runtime.ts",
  output : {
    path         : path.resolve(__dirname, "../dist"),
    filename     : "vue.js",
    // library      : "Vue",
    // libraryTarget: "var",
    // libraryExport: "default"
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.resolve(__dirname, "../dist"),
    port: 9999
  },
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
  },
  plugins: []
};
