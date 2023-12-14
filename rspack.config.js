const { ProgressPlugin } = require('@rspack/core')
const NodePolyfill = require('@rspack/plugin-node-polyfill')
const path = require('path')

const swcLoader = {
  loader: 'builtin:swc-loader',
  options: {
    sourceMap: true,
    minify: true,
    env: {
      targets: {
        chrome: '70',
        ie: '11',
      },
      mode: 'usage',
      coreJs: '3.22',
    },
    jsc: {
      parser: {
        syntax: 'typescript',
      },
      minify: {
        compress: {
          unused: true,
        },
        mangle: true,
      },
    },
  },
}

/** @type {import('@rspack/cli').Configuration} */
module.exports = {
  entry: {
    main: {
      filename: 'main.js',
      import: path.resolve(__dirname, './src/index.ts'),
      library: {
        name: 'main',
        type: 'global'
      }
    },
  },
  plugins: [new ProgressPlugin(), new NodePolyfill()],
  mode: 'production',
  target: ['web', 'es5'],
  experiments: {
    rspackFuture: {
      newTreeshaking: true,
    },
  },
  stats: {
    colors: true,
    preset: 'normal',
  },
  devtool: 'source-map',
  output: {
    clean: true,
    publicPath: `./`,
    libraryTarget: 'umd',
    path: path.resolve(__dirname, './dist'),
    chunkFilename: '[id].[contenthash:12].js',
    crossOriginLoading: 'anonymous',
  },
  resolve: {
    extensions: ['.ts', '.js', '.mjs', '.html'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    modules: ['node_modules', 'src'],
    mainFields: ['browser', 'module', 'main'],
    preferRelative: true,
  },
  optimization: {
    chunkIds: 'deterministic',
    mergeDuplicateChunks: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/i,
        type: 'javascript/auto',
        include: [path.resolve(__dirname, './src')],
        use: [swcLoader],
      },
    ],
  },
}
