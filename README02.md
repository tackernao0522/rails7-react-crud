# Railsアプリを新規作成する(Shakapackerの場合)

## [Rails7とReactによるCRUDアプリ作成チュートリアル](https://techracho.bpsinc.jp/hachi8833/2022_05_26/118202) <br>

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

## 02. APIを構築する

+ `$ ./bin/rails g model Event event_type:string event_date:date title:text speaker:string host:string published:boolean`を実行<br>

+ `$ ./bin/rails db:migrate`を実行<br>

+ `$ mkdir db/seeds && touch $_/events.json`を実行<br>

+ `$ db/seeds/events.json`を編集<br>

```json:events.json
[
  {
    "event_type": "Symposium",
    "event_date": "2022-07-14",
    "title": "Ada Lovelace — The Making of a Computer Scientist",
    "speaker": "Monica S. Lam, Yoky Matsuoka, Dorit Aharonov",
    "host": "Ursula Martin",
    "published": false
  },
  {
    "event_type": "Colloquium",
    "event_date": "2022-04-12",
    "title": "Scholasticism in Medieval and Early Modern History",
    "speaker": "Robin Fleming",
    "host": "Henry Louis Gates Jr.",
    "published": true
  },
  {
    "event_type": "Symposium",
    "event_date": "2022-03-30",
    "title": "Charles II and the English Restoration",
    "speaker": "Kate Williams, Patrick Morrah, Charles Spencer",
    "host": "Lucy Worsley",
    "published": true
  },
  {
    "event_type": "Symposium",
    "event_date": "2022-03-01",
    "title": "Remembering the Titanic, One of the Greatest Ever Maritime Tragedies",
    "speaker": "William Hazelgrove, Lauren Tarshis, Andrew Wilson",
    "host": "Dan Snow",
    "published": true
  },
  {
    "event_type": "Symposium",
    "event_date": "2022-02-07",
    "title": "Symbolism in Portraits of Queen Elizabeth I",
    "speaker": "David Starkey, Susan Doran, Alison Weir",
    "host": "Suzannah Lipscomb",
    "published": true
  },
  {
    "event_type": "Colloquium",
    "event_date": "2021-12-19",
    "title": "A Brief History Of China's Dynasties",
    "speaker": "Iris Chang",
    "host": "Pamela Kyle Crossley",
    "published": true
  }
]
```

+ `db/seeds.rb`を編集<br>

```rb:seeds.rb
json = ActiveSupport::JSON.decode(File.read('db/seeds/events.json'))
json.each do |record|
  Event.create!(record)
end
```

+ `$ ./bin/rails db:seed`を実行<br>

+ `$ ./bin/rails c`を実行<br>

+ `下記の結果になればOK`<br>

```:terminal
>> Event.all.count
  Event Count (1.3ms)  SELECT COUNT(*) FROM `events`
=> 6
```

## 03 コントローラ

+ `mkdir app/controllers/api && touch $_/events_controller.rb`を実行<br>

+ `app/controllers/api/events_controller.rb`を編集<br>

```rb:events_controller.rb
class Api::EventsController < ApplicationController
  before_action :set_event, only: %i[show update destroy]

  def index
    @events = Event.all
    render json: @events
  end

  def show
    render json: @event
  end

  def create
    @event = Event.new(event_params)

    if @event.save
      render json: @event, status: :created
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  def update
    if @event.update(event_params)
      render json: @event, status: :ok
    else
      render json: @event.errors, status: :upprocessable_entity
    end
  end

  def destroy
    @event.destroy
  end

  private

  def event_params
    params.require(:event).permit(
      :id,
      :event_type,
      :event_date,
      :title,
      :speaker,
      :host,
      :published,
      :created_at,
      :updated_at
    )
  end
end
```

+ [How to Create a Rails Backend API | by Jackson Chen | Geek Culture | Medium](https://medium.com/geekculture/how-to-create-a-rails-backend-api-871fcddd6e20) <br>

+ [クロスサイトリクエストフォージェリ](https://railsguides.jp/security.html?version=7.0#%E3%82%AF%E3%83%AD%E3%82%B9%E3%82%B5%E3%82%A4%E3%83%88%E3%83%AA%E3%82%AF%E3%82%A8%E3%82%B9%E3%83%88%E3%83%95%E3%82%A9%E3%83%BC%E3%82%B8%E3%82%A7%E3%83%AA%EF%BC%88csrf%EF%BC%89) <br>

+ `app/controllers/application_controller.rb`を編集<br>

```rb:application_controller.rb
class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session
end
```

+ [Understanding Rails’ Forgery Protection Strategies](https://marcgg.com/blog/2016/08/22/csrf-rails/) <br>

+ [A Deep Dive into CSRF Protection in Rails](https://medium.com/rubyinside/a-deep-dive-into-csrf-protection-in-rails-19fa0a42c0ef) <br>

+ [Rails CSRF protection for SPA](https://blog.eq8.eu/article/rails-api-authentication-with-spa-csrf-tokens.html) <br>

+ [Configuring Rails as a JSON API](https://thinkster.io/tutorials/rails-json-api/configuring-rails-as-a-json-api) <br>

## ルーティング

+ `config/routes.rb`を編集<br>

```rb:routes.rb
Rails.application.routes.draw do
  root to: 'site#index'

  namespace :api do
    resources :events, only: %i[index show create destroy update]
  end
end
```

+ Postmanによる確認 (http://localhost:3000/api/events)<br>

```:json
[
    {
        "id": 1,
        "event_type": "Symposium",
        "event_date": "2022-07-14",
        "title": "Ada Lovelace — The Making of a Computer Scientist",
        "speaker": "Monica S. Lam, Yoky Matsuoka, Dorit Aharonov",
        "host": "Ursula Martin",
        "published": false,
        "created_at": "2022-10-02T16:11:41.585Z",
        "updated_at": "2022-10-02T16:11:41.585Z"
    },
    {
        "id": 2,
        "event_type": "Colloquium",
        "event_date": "2022-04-12",
        "title": "Scholasticism in Medieval and Early Modern History",
        "speaker": "Robin Fleming",
        "host": "Henry Louis Gates Jr.",
        "published": true,
        "created_at": "2022-10-02T16:11:41.593Z",
        "updated_at": "2022-10-02T16:11:41.593Z"
    },
    {
        "id": 3,
        "event_type": "Symposium",
        "event_date": "2022-03-30",
        "title": "Charles II and the English Restoration",
        "speaker": "Kate Williams, Patrick Morrah, Charles Spencer",
        "host": "Lucy Worsley",
        "published": true,
        "created_at": "2022-10-02T16:11:41.599Z",
        "updated_at": "2022-10-02T16:11:41.599Z"
    },
    {
        "id": 4,
        "event_type": "Symposium",
        "event_date": "2022-03-01",
        "title": "Remembering the Titanic, One of the Greatest Ever Maritime Tragedies",
        "speaker": "William Hazelgrove, Lauren Tarshis, Andrew Wilson",
        "host": "Dan Snow",
        "published": true,
        "created_at": "2022-10-02T16:11:41.605Z",
        "updated_at": "2022-10-02T16:11:41.605Z"
    },
    {
        "id": 5,
        "event_type": "Symposium",
        "event_date": "2022-02-07",
        "title": "Symbolism in Portraits of Queen Elizabeth I",
        "speaker": "David Starkey, Susan Doran, Alison Weir",
        "host": "Suzannah Lipscomb",
        "published": true,
        "created_at": "2022-10-02T16:11:41.611Z",
        "updated_at": "2022-10-02T16:11:41.611Z"
    },
    {
        "id": 6,
        "event_type": "Colloquium",
        "event_date": "2021-12-19",
        "title": "A Brief History Of China's Dynasties",
        "speaker": "Iris Chang",
        "host": "Pamela Kyle Crossley",
        "published": true,
        "created_at": "2022-10-02T16:11:41.617Z",
        "updated_at": "2022-10-02T16:11:41.617Z"
    }
]
```

## 04. イベントマネージャをscaffoldで作成する

### イベントをフェッチする

+ `$ touch app/javascript/components/{Editor.js,Header.js,EventList.js}`を実行<br>

[prop-types](https://www.npmjs.com/package/prop-types) <br>

+ `$ yarn add prop-types`を実行(Shakapackerの場合はyarnである)<br>

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

import React, { StrictMode } from 'react' // 編集
import { createRoot } from 'react-dom/client'
import { App } from './components/App' // 編集

const container = document.getElementById('root')
const root = createRoot(container)

document.addEventListener('DOMContentLoaded', () => {
  root.render(
    // 編集
    <StrictMode>
      <App />
    </StrictMode>,
    // ここまで
  )
})
```

+ [strict モード - React](https://ja.reactjs.org/docs/strict-mode.html) <br>

## Reactの[フック](https://ja.reactjs.org/docs/hooks-overview.html)でデータをフェッチする

+ `app/javascript/components/App.js`を編集<br>

```js:App.js
import React from 'react';
import { Editor } from './Editor';

export const App = () => {
  return (
    <Editor />
  )
}
```

+ `app/javascript/components/Editor.js`を編集<br>

```js:Editor.js
import React, { useState, useEffect } from 'react';
import { EventList } from './EventList';
import { Header } from './Header';

export const Editor = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await window.fetch('/api/events');
        if (!response.ok) throw Error(response.statusText);
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        setIsError(true);
        console.error(error);
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />
      {isError && <p>Something went wrong. Check the console.</p>}

      {isLoading ? <p>Loading...</p> : <EventList events={events} />}
    </>
  );
};
```

[Fetch API](https://developer.mozilla.org/ja/docs/Web/API/Fetch_API) <br>

[Handling Failed HTTP Responses With fetch()](https://www.tjvantoll.com/2015/09/13/fetch-and-errors/) <br>

+ `app/javascript/components/Header.js`を編集<br>

```js:Header.js
import React from 'react';

export const Header = () => {
  return (
    <header>
      <h1>Event Manager</h1>
    </header>
  )
}
```

+ `app/javascript/components/EventList.js`を編集<br>

```js:EventList.js
import React from 'react';
import PropTypes from 'prop-types';

export const EventList = ({ events }) => {
  const renderEvents = (eventArray) => {
    eventArray.sort((a, b) => new Date(b.event_date) - new Date(a.event_date));

    return eventArray.map((event) => (
      <li key={event.id}>
        {event.event_date}
        {' - '}
        {event.event_type}
      </li>
    ));
  };

  return (
    <section>
      <h2>Events</h2>
      <ul>{renderEvents(events)}</ul>
    </section>
  );
};

EventList.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    event_type: PropTypes.string,
    event_date: PropTypes.string,
    title: PropTypes.string,
    speaker: PropTypes.string,
    host: PropTypes.string,
    published: PropTypes.bool,
  })).isRequired,
};
```

+ localhost:3000にアクセスしてみる <br>
