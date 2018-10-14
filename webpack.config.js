const path     = require('path');

const baseConfig = {
  mode: 'production',
  entry: path.resolve(__dirname, 'dist/node.esnext/index.js'),
  resolve: {
    extensions: [ '.ts', '.js', ],
  },

  node: {
    crypto: 'empty',
    fs: 'empty',
  },

  performance: {
    hints: 'warning',
    maxAssetSize: 200000,
    maxEntrypointSize: 400000,
    assetFilter(assetFilename) {
      return assetFilename.endsWith('.js') || assetFilename.endsWith('.ts');
    },
  },

  devtool: 'source-map',
  context: __dirname,
  stats: 'errors-only',
  profile: false,
  bail: true,
  cache: false,
};

const esFiveBrowserConfig = Object.assign({}, baseConfig, {
  output: {
    path: path.resolve(__dirname, 'dist/browser.es5/'),
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
                      'ie >= 8',
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

const esSixBrowserConfig = Object.assign({}, baseConfig, {
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
});

module.exports = [
  esFiveBrowserConfig,
  esSixBrowserConfig,
];