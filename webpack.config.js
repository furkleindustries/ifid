const path = require('path');

const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';
const baseConfig = {
  mode,
  entry: path.resolve(__dirname, 'dist/node.esnext/index.js'),
  resolve: {
    extensions: [ '.ts', '.js', ],
  },

  node: {
    crypto: 'empty',
    fs: 'empty',
    process: false,
  },

  performance: {
    hints: 'warning',
    maxAssetSize: 200000,
    maxEntrypointSize: 400000,
    assetFilter(assetFilename) {
      return /\.[jt]$/.test(assetFilename);
    },
  },

  devtool: 'source-map',
  context: __dirname,
  stats: 'verbose',
  profile: false,
  bail: true,
  cache: false,
};

const esFiveBrowserConfig = Object.assign({}, baseConfig, {
  output: {
    path: path.resolve(__dirname, 'dist/browser/'),
    filename: 'index.js',
    library: 'ifid',
    libraryTarget: 'umd',
    globalObject: 'this',
  },

  module: {
    rules: [
      {
        test: /\.[jt]s$/,
        include: [
          path.resolve(__dirname, 'dist/node.esnext/'),
        ],

        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              [
                '@babel/preset-env',

                {
                  targets: {
                    browsers: [
                      'ie >= 8',
                      '> 1%'
                    ],
                  },

                  loose: true,
                  modules: false,
                },
              ],
            ],
          },
        },
      },
    ],
  },
});

// This is producing the exact same bundle size as the above es5 config.
/*const esSixBrowserConfig = Object.assign({}, baseConfig, {
  output: {
    path: path.resolve(__dirname, 'dist/browser.es6/'),
    filename: 'index.js',
    library: 'ifid',
    libraryTarget: 'umd',
  },

  module: {
    rules: [
      {
        test: /\.[jt]s$/,
        include: [
          path.resolve(__dirname, 'dist/node.esnext/'),
        ],

        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              [
                '@babel/preset-env',

                {
                  targets: {
                    browsers: [
                      '>1%',
                    ],
                  },

                  loose: true,
                  modules: false,
                },
              ],
            ],
          },
        },
      },
    ],
  },
});*/

module.exports = [
  esFiveBrowserConfig,
  /*esSixBrowserConfig,*/
];