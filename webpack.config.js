module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ]
  },
  resolve: {
    fallback: {
      'buffer': require.resolve('buffer/'),
      'url': require.resolve('url/'),
      'stream': require.resolve('stream-browserify'),
      'querystring': require.resolve('querystring-es3'),
      'http': require.resolve('stream-http'),
      'crypto': require.resolve('crypto-browserify'),
      'zlib': require.resolve('browserify-zlib'),
      'assert': require.resolve('assert/'),
    }
  },
};