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
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    historyApiFallback: true,
    hot: true,
    https: false,
    noInfo: true,
  },

  profile: false,
  bail: true,
  cache: false,
};

const esThreeBrowserConfig = Object.assign({}, baseConfig, {
  output: {
    path: path.resolve(__dirname, 'dist/es3.browser/'),
    filename: 'index.js',
    libraryTarget: 'umd',
  },

  node: {
    fs: 'empty',
  },

  module: {
    rules: [
      {
        test: /\.(j|t)s$/,
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
                      /* Since ten years ago. */
                      'since 2008',
                    ],
                  },

                  loose: true,
                  modules: false
                },
              ],

              'stage-0',
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

const esFiveBrowserConfig = Object.assign({}, baseConfig, {
  output: {
    path: path.resolve(__dirname, 'dist/es5.browser/'),
    filename: 'index.js',
    libraryTarget: 'umd',
  },

  module: {
    rules: [
      {
        test: /\.(j|t)s$/,
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
                      /* Since five years ago. */
                      'since 2013',
                    ],
                  },

                  loose: true,
                  modules: false
                },
              ],

              'stage-0',
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
});

module.exports = [
  esThreeBrowserConfig,
  esFiveBrowserConfig,
  esSixBrowserConfig,
];