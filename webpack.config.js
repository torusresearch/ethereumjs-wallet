/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

const pkg = require("./package.json");

const pkgName = "wallet";
const libraryName = pkgName.charAt(0).toUpperCase() + pkgName.slice(1);

const { NODE_ENV = "production" } = process.env;

const baseConfig = {
  mode: NODE_ENV,
  devtool: NODE_ENV === "production" ? false : "source-map",
  entry: "./src/index.ts",
  target: "web",
  output: {
    path: path.resolve(__dirname, "dist"),
    library: libraryName,
    libraryExport: "default",
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
  module: {
    rules: [],
  },
};

// const optimization = {
//   optimization: {
//     minimize: false,
//   },
// };

const babelLoaderWithPolyfills = {
  test: /\.m?js$/,
  exclude: /(node_modules|bower_components)/,
  use: {
    loader: "babel-loader",
  },
};

const tsLoader = {
  test: /\.ts?$/,
  exclude: /(node_modules|bower_components)/,
  use: {
    loader: "ts-loader",
    options: {
      // disable type checker - we will use it in fork plugin
      transpileOnly: true,
      configFile: NODE_ENV === "production" ? "tsconfig.prod.json" : "tsconfig.json",
    },
  },
};

const babelLoader = { ...babelLoaderWithPolyfills, use: { loader: "babel-loader", options: { plugins: ["@babel/transform-runtime"] } } };

const umdConfig = {
  ...baseConfig,
  output: {
    ...baseConfig.output,
    filename: `${pkgName}.umd.min.js`,
    libraryTarget: "umd",
  },
  module: {
    rules: [tsLoader, babelLoader],
  },
};

module.exports = [umdConfig];
// module.exports = [cjsConfig];
// V5
// experiments: {
//   outputModule: true
// }

// node: {
//   global: true,
// },
// resolve: {
//   alias: { crypto: 'crypto-browserify', stream: 'stream-browserify', vm: 'vm-browserify' },
//   aliasFields: ['browser'],
// },
