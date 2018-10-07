const path     = require('path');
const uglifyjs = require('uglifyjs-webpack-plugin');
const webpack  = require('webpack');

const baseConfig = {
  entry: path.resolve(__dirname, 'dist/esnext.node/index.js'),
  resolve: {
    extensions: [ '.ts', '.js', ],
  },

  node: {
    fs: 'empty',
  },

  plugins: [
    new uglifyjs({ sourceMap: true, }),
  ],

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
    path: path.resolve(__dirname, 'dist/es5.browser/'),
    filename: 'index.js',
    libraryTarget: 'umd',
  },

  module: {
    rules: [
      {
        test: /\.[jt]s$/,
        include: [
          path.resolve(__dirname, 'dist/esnext.node/'),
        ],

        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                'env',

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

              'stage-1',
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

const esSixBrowserConfig = Object.assign({}, baseConfig, {
  output: {
    path: path.resolve(__dirname, 'dist/es6.browser/'),
    filename: 'index.js',
    libraryTarget: 'umd',
  },

  module: {
    rules: [
      {
        test: /\.[jt]s$/,
        include: [
          path.resolve(__dirname, 'dist/esnext.node/'),
        ],

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
                    ],
                  },

                  loose: true,
                  modules: false,
                },
              ],

              'stage-1',
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