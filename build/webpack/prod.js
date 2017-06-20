/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

// This is our base config file.  All of our configs will extend from this,
// so we'll define all the foundational stuff that applies to every build
// and add to it in other files

// ----------------------
// IMPORTS

/* NPM */

// Webpack 2 is our bundler of choice.
import path from 'path';
import webpack from 'webpack';

// We'll use `webpack-config` to create a 'base' config that can be
// merged/extended from for further configs
import WebpackConfig from 'webpack-config';


import HtmlWebpackPlugin from 'html-webpack-plugin';

/* Local */

// Common config
// import { stats } from './common';

// Our local path configuration, so webpack knows where everything is/goes.
// Since we haven't yet established our module resolution paths, we have to
// use the full relative path
import PATHS from '../../config/paths';

// ----------------------

// Export a new 'base' config, which we can extend/merge from
export default new WebpackConfig().merge({

  // Format the output stats to avoid too much noise
  // stats,
  entry: {
    // Client specific source code.  This is the stuff we write.
    app: [
      // Entry point for the browser
      PATHS.entry
    ],
  },

  // Output settings.  Where our files will wind up, and what we consider
  // to be the root public path for dev-server.
  output: {

    // Our compiled bundles/static files will wind up in `dist/public`
    path: PATHS.dist,

    // Deem the `dist` folder to be the root of our web server
    publicPath: '/',

    // Filenames will simply be <name>.js
    filename: 'assets/js/[name].js',
  },

  // Javascript file extensions that webpack will resolve
  resolve: {
    // I tend to use .js exclusively, but .jsx is also allowed
    extensions: ['.js'],

    // When we do an `import x from 'x'`, webpack will first look in our
    // root folder to try to resolve the package this.  This allows us to
    // short-hand imports without knowing the full/relative path.  If it
    // doesn't find anything, then it'll check `node_modules` as normal
    modules: [
      PATHS.root,
      'node_modules',
    ],
  },

  // File type config and the loaders that will handle them.  This makes it
  // possible to do crazy things like `import css from './style.css'` and
  // actually get that stuff working in *Javascript* -- woot!
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: [
          {
            loader: 'babel-loader',
            query: {
              // Ignore the .babelrc at the root of our project-- that's only
              // used to compile our webpack settings, NOT for bundling
              babelrc: false,
              presets: [
                ['env', {
                  targets: {
                    "browser" : ["chrome > 45"]
                  },
                  // Enable tree-shaking by disabling commonJS transformation
                  modules: false,
                  useBuiltIns: true
                  // Exclude default regenerator-- we want to enable async/await
                  // so we'll do that with a dedicated plugin
                  // exclude: ['transform-regenerator'],
                }],
                // Transpile JSX code
                // 'react',
              ],
              // plugins: [
              //   'transform-object-rest-spread',
              //   'syntax-dynamic-import',
              //   'transform-regenerator',
              //   'transform-class-properties',
              //   'transform-decorators-legacy',
              // ],
            },
          },
        ],
      },
      // Fonts
      {
        test: /\.(woff|woff2|ttf|eot)$/i,
        loader: 'file-loader',
        query: {
          name: 'assets/fonts/[name].[hash].[ext]',
        },
      },

      // GraphQL queries
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },

      // Images.  By default, we'll just use the file loader.  In production,
      // we'll also crunch the images first -- so let's set up `loaders` to
      // be an array to make extending this easier
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          {
            loader: 'file-loader',
            query: {
              name: 'assets/img/[name].[hash].[ext]',
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(PATHS.src, 'index.html'),
      inject: true
    }),

    // new webpack.optimize.UglifyJsPlugin({
    //   mangle: true,
    //   compress: {
    //     warnings: false, // Suppress uglification warnings
    //     pure_getters: true,
    //     unsafe: true,
    //     unsafe_comps: true,
    //     screw_ie8: true,
    //   },
    //   output: {
    //     comments: false,
    //   },
    //   exclude: [/\.min\.js$/gi], // skip pre-minified libs
    // }),
  ],
});
