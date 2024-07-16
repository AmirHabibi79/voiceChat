const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = (env, args) => {
  const SERVER_URL =
    env.IS_HTTPS === "true"
      ? JSON.stringify("https://" + env.SERVER_DOMAIN + ":" + env.SERVER_PORT)
      : JSON.stringify("http://" + env.SERVER_DOMAIN + ":" + env.SERVER_PORT);
  return {
    mode: "development",
    entry: {
      index: "./index.js",
    },
    devtool: args.mode === "development" ? "inline-source-map" : "source-map",
    devServer: {
      static: "./dist",
    },
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
    },
    optimization: {
      runtimeChunk: "single",
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "voice chat",
      }),
      new webpack.DefinePlugin({
        "process.env": {
          SERVER_URL,
        },
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/i,

          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          include: path.resolve(__dirname, "src"),
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
  };
};
