const minify = require('babel-preset-minify');
const path = require('path');
const uglifyjs = require('uglifyjs-webpack-plugin');

const baseConfig = {
  // Here the application starts executing
  // and webpack starts bundling
  entry: path.resolve(__dirname, 'dist/esnext.node/index.js'), // string | object | array

  resolve: {
    extensions: [ '.ts', '.tsx', '.js', '.jsx', ],
  },
  
  node: {
    crypto: 'empty',
    fs: 'empty',
    os: 'empty',
  },

  performance: {
    hints: 'warning', // enum
    maxAssetSize: 200000, // int (in bytes),
    maxEntrypointSize: 400000, // int (in bytes)
    assetFilter(assetFilename) {
      // Function predicate that provides asset filenames
      return assetFilename.endsWith('.css') ||
        assetFilename.endsWith('.less');
        assetFilename.endsWith('.js') ||
        assetFilename.endsWith('.ts');
    },
  },

  // enhance debugging by adding meta info for the browser devtools
  // source-map most detailed at the expense of build speed.
  devtool: 'source-map', // enum

  // the home directory for webpack
  // the entry and module.rules.loader option
  //   is resolved relative to this directory
  context: __dirname, // string (absolute path!)

  // lets you precisely control what bundle information gets displayed
  stats: 'errors-only',

  devServer: {
    contentBase: path.join(__dirname, 'public'), // boolean | string | array, static file location
    compress: true, // enable gzip compression
    historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    https: false, // true for self-signed, object for cert authority
    noInfo: true, // only errors & warns on hot reload
  },

  plugins: [],

  profile: false, // boolean
  // capture timing information

  bail: true, // boolean

  // disable/enable caching
  cache: false, // boolean
};

const esSixBrowserConfig = Object.assign({}, baseConfig, {
  output: {
    path: path.resolve(__dirname, 'dist/es6.browser/'),
    filename: 'index.js',
    libraryTarget: 'umd',
  },

  plugins: [ new uglifyjs(), ],
});

const esFiveBrowserConfig = Object.assign({}, baseConfig, {
  output: {
    path: path.resolve(__dirname, 'dist/es5.browser/'),
    filename: 'index.js',
    libraryTarget: 'umd',
  },

  module: {
    rules: [
      {
        // these are matching conditions, each accepting a regular expression or string
        // test and include have the same behavior, both must be matched
        // exclude must not be matched (takes preferrence over test and include)
        // Best practices:
        // - Use RegExp only in test and for filename matching
        // - Use arrays of absolute paths in include and exclude
        // - Try to avoid exclude and prefer include
        test: /\.(j|t)sx?$/,

        include: [ path.resolve(__dirname, 'dist/esnext.node/'), ],

        // the loader which should be applied, it'll be resolved relative to the context
        // -loader suffix is no longer optional in webpack2 for clarity reasons
        // see webpack 1 upgrade guide
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                'env',
                {
                  targets: {
                    browsers: [
                      '>1%',
                      'last 12 versions',
                    ],
                  },

                  loose: true,
                  modules: false
                },
              ],

              'stage-0',
              'minify',
            ],

            plugins: [
              'transform-object-assign',
            ],
          },
        },
      },
    ],
  },
});

module.exports = [
  esFiveBrowserConfig,
  esSixBrowserConfig,
];