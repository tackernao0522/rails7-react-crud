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

## 02 Hello World Reactアプリを作成

+ `$ rails g controller site index`を実行<br>

+ `app/views/site/index.html.erb`を編集<br>

```html:index.html.erb
<div id="root"></div>
```

+ `$ mkdir app/javascript/components && touch $_/App.js`を実行<br>

+ `app/javascript/application.js`を編集<br>

```js:application.js
/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

// Uncomment to copy all static images under ./images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('./images', true)
// const imagePath = (name) => images(name, true)

// 追加
import React from 'react'
import { createRoot } from 'react-dom/client'
import HelloMessage from './components/App'

const container = document.getElementById('root')
const root = createRoot(container)

document.addEventListener('DOMContentLoaded', () => {
  root.render(<HelloMessage name="World" />)
})
// ここまで
```

+ `app/javascript/components/App.js`を編集<br>

```js:App.js
import React from 'react'

const HelloMessage = ({ name }) => <h1>Hello, {name}!</h1>

export default HelloMessage
```

+ `config/routes.rb`を編集<br>

```rb:routes.rb
Rails.application.routes.draw do
  root to: 'site#index'
end
```

+ `$ rails s`を実行<br>

+ 別のターミナルで `$ ./bin/webpacker-dev-server`を実行<br>

+ localhost:3000にアクセスしてみる<br>
