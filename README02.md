# Railsアプリを新規作成する(Shakapackerの場合)

+ `$ rails _7.0.2.3_ new event-manager --database=mysql --skip-javascript`を実行<br>

+ `$ bundle add shakapacker --version "6.2.1" --strict`を実行<br>

+ `$ npm i -g yarn`を実行<br>

+ `$ ./bin/bundle install`を実行<br>

+ `$ ./bin/rails webpacker:install`を実行<br>

+ `$ yarn add react react-dom @babel/preset-react`を実行<br>

+ `package.json`を編集<br>

```json:package.json
{
  "name": "app",
  "private": true,
  "dependencies": {
    "@babel/core": "7",
    "@babel/plugin-transform-runtime": "7",
    "@babel/preset-env": "7",
    "@babel/preset-react": "^7.18.6",
    "@babel/runtime": "7",
    "babel-loader": "8",
    "compression-webpack-plugin": "9",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "shakapacker": "6.5.0",
    "terser-webpack-plugin": "5",
    "webpack": "5",
    "webpack-assets-manifest": "5",
    "webpack-cli": "4",
    "webpack-dev-server": "^4.11.1",
    "webpack-merge": "5"
  },
  "version": "0.1.0",
  "babel": {
    "presets": [
      "./node_modules/shakapacker/package/babel/preset.js",
      "@babel/preset-react" // 追加
    ]
  },
  "browserslist": [
    "defaults"
  ]
}
```
