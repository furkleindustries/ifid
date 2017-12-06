const path = require('path');

module.exports = {
  // Here the application starts executing
  // and webpack starts bundling
  entry: path.resolve(__dirname, 'src/exports.ts'), // string | object | array

  // options related to how webpack emits results
  output: {
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)
    path: path.resolve(__dirname, 'dist'), // string

    // the filename template for entry chunks
    filename: 'index.js', // string

    // the name of the exported library
    library: 'TwineTree', // string,

    libraryTarget: 'commonjs',
  },

  resolve: {
    extensions: [ '.ts', '.tsx', '.js', '.jsx', ],
  },

  module: {
    // configuration regarding modules
    rules: [
      // rules for modules (configure loaders, parser options, etc.)
      {
        // these are matching conditions, each accepting a regular expression or string
        // test and include have the same behavior, both must be matched
        // exclude must not be matched (takes preferrence over test and include)
        // Best practices:
        // - Use RegExp only in test and for filename matching
        // - Use arrays of absolute paths in include and exclude
        // - Try to avoid exclude and prefer include
        test: /\.(j|t)sx?$/,
        include: [ path.resolve(__dirname, 'src'), ],

        // the loader which should be applied, it'll be resolved relative to the context
        // -loader suffix is no longer optional in webpack2 for clarity reasons
        // see webpack 1 upgrade guide
        loader: 'awesome-typescript-loader',
        query: {
          useBabel: true,
          useCache: true,
        },
      },
    ],
  },

  node: {
    fs: 'empty',
  },

  performance: {
    hints: 'warning', // enum
    maxAssetSize: 200000, // int (in bytes),
    maxEntrypointSize: 400000, // int (in bytes)
    assetFilter(assetFilename) {
      // Function predicate that provides asset filenames
      return assetFilename.endsWith('.css') ||
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

  profile: true, // boolean
  // capture timing information

  bail: true, // boolean

  // disable/enable caching
  cache: false, // boolean
};
