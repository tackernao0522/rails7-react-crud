## 05. ESLint

+ `$ yarn add -D eslint`を実行<br>

+ [Airbnb config](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) <br>

+ [AirbnbのJavaScriptスタイルガイド](https://github.com/airbnb/javascript) <br>

+ `$ yarn add -D eslint-config-airbnb`を実行<br>

+ `$ npm info "eslint-config-airbnb@latest" peerDependencies`を実行<br>

+ 結果<br>

```
{
  eslint: '^7.32.0 || ^8.2.0',
  'eslint-plugin-import': '^2.25.3',
  'eslint-plugin-jsx-a11y': '^6.5.1',
  'eslint-plugin-react': '^7.28.0',
  'eslint-plugin-react-hooks': '^4.3.0'
}
```

```
上で得た残りの4つのパッケージをpackage.jsonのdevDependenciesセクションに追加し（訳注: 'は"に置き換えます）、
npm i（またはyarn install）を実行してインストールします。
```

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
    "prop-types": "^15.8.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "shakapacker": "6.2.1",
    "terser-webpack-plugin": "5",
    "webpack": "5",
    "webpack-assets-manifest": "5",
    "webpack-cli": "4",
    "webpack-merge": "5"
  },
  "version": "0.1.0",
  "babel": {
    "presets": [
      "./node_modules/shakapacker/package/babel/preset.js",
      "@babel/preset-react"
    ]
  },
  "browserslist": [
    "defaults"
  ],
  "devDependencies": {
    "eslint": "^8.24.0",
    "eslint-config-airbnb": "^19.0.4",
    "webpack-dev-server": "^4.11.1",
    // 追加
    "eslint-plugin-import": "^2.25.3",
    "eslint-plugin-jsx-a11y": "^6.5.1",
    "eslint-plugin-react": "^7.28.0",
    "eslint-plugin-react-hooks": "^4.3.0"
    // ここまで
  }
}
```

+ `$ yarn install`を実行<br>

+ `$ touch .eslintrc.js`を実行<br>

+ `.eslintrc.js`を編集<br>

```js:.eslit.js
module.exports = {
  root: true,
  extends: ['airbnb', 'airbnb/hooks'],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/function-component-definition': [
      1,
      { namedComponents: 'arrow-function' },
    ],
    'no-console': 0,
    'no-alert': 0,
  },
}
```

+ [eslint-plugin-react/function-component-definition.md at master · jsx-eslint/eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/function-component-definition.md) <br>

+ `$ ./node_modules/.bin/eslint app/javascript`を実行<br>