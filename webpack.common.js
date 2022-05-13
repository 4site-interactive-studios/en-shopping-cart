const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/index.ts",
  mode: "development",
  devtool: "source-map",
  optimization: {
    usedExports: true,
  },
  output: {
    filename: "en-shopping-cart.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            // disable type checker - we will use it in fork plugin
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.(scss|css)$/,
        use: [
          // "style-loader",
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "en-shopping-cart.css",
      chunkFilename: "[id].css",
    }),
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new ESLintPlugin({
      extensions: [".tsx", ".ts", ".js"],
      exclude: "node_modules",
    }),
  ],
};
