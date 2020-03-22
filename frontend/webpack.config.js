const path = require("path");

module.exports = {
  mode: "development",
  context: path.join(__dirname, "src"),
  entry: ["./main.tsx"],
  output: {
    path: path.join(__dirname, "www"),
    filename: "bundle.js"
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.sass$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.(svg|png)$/,
        exclude: /node_modules/,
        use: ["file-loader"]
      },
      {
        test: /\.tsx?$/,
        use: ['babel-loader', 'ts-loader'],
        exclude: /node_modules/,
      }
    ]
  }
};
