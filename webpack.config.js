const path = require('path');

module.exports = {
  entry: './src/game.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: path.resolve(__dirname, 'src'),
        loader: 'ts-loader'
      },
      {
        test: require.resolve('Phaser'),
        loader: 'expose-loader',
        options: { exposes: { globalName: 'Phaser', override: true } }
      }
    ]
  },
  devServer: {
    static: path.resolve(__dirname, './'),
    host: 'localhost',
    port: 8080,
    open: false,
    historyApiFallback: true,
    allowedHosts: 'all',
    proxy: {
      '/api': {
        // /api로 시작하는 경로일 경우, ex) /api/rest/myInfo
        changeOrigin: true,
        cookieDomainRewrite: 'localhost',
        target: 'https://fortuneapi.herokuapp.com/', // 요청 url 앞에 target을 붙여주기, ex) http://localhost:8080/api/rest/myInfo
        pathRewrite: { '/api': '/' } // /api에 해당하는 url을 없애기, ex) http://localhost:8080/rest/myInfo
      }
    }
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
};
