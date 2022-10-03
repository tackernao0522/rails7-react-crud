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

## 06. イベントを表示する

+ `$ yarn add react-router-dom@6`を実行<br>

+ [React Router 6 Tutorial](https://www.robinwieruch.de/react-router/) <br>

+ `config/routes.rb`を編集<br>

```rb:routes.rb
Rails.application.routes.draw do
  root to: redirect('/events')

  get 'events', to: 'site#index'
  get 'events/new', to: 'site#index'
  get 'events/:id', to: 'site#index'
  get 'events/:id/edit', to: 'site#index'

  namespace :api do
    resources :events, only: %i[index show create destroy update]
  end
end
```

+ `app/javascript/application.js`を編集<br>

```js:application.js
/* eslint-disable no-undef */
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 追加
import App from './components/App';

const container = document.getElementById('root');
const root = createRoot(container);

document.addEventListener('DOMContentLoaded', () => {
  root.render(
    <StrictMode>
      <BrowserRouter> // 追加
        <App />
      </BrowserRouter> // 追加
    </StrictMode>,
  );
});
```

+ `app/javascript/components/App.js`を編集<br>

```js:App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom'; // 追加
import Editor from './Editor';

const App = () => (
  // 編集
  <Routes>
    <Route path="events/*" element={<Editor />} />
  </Routes>
  // ここまで
);

export default App;
```

+ [<Route> コンポーネント](https://reactrouterdotcom.fly.dev/docs/en/v6/components/routes) <br>

+ `$ touch app/javascript/components/Event.js`を実行<br>

+ `app/javascript/components/Editor.js`を編集<br>

```js:Editor.js
import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Event from './Event'; // 追加
import EventList from './EventList';
import Header from './Header';

const Editor = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // eslint-disable-next-line no-undef
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
      // 編集
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <EventList events={events} />

          <Routes>
            <Route path=":id" element={<Event events={events} />} />
          </Routes>
        </>
      )}
      // ここまで
    </>
  );
};

export default Editor;
```

+ `app/javascript/components/Event.js`を編集<br>

```js:Event.js
import React from 'react'; // 必須
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

const Event = ({ events }) => {
  const { id } = useParams();
  const event = events.find((e) => e.id === Number(id));

  return (
    <>
      <h2>
        {event.event_date}
        {' _ '}
        {event.event_type}
      </h2>
      <ul>
        <li>
          <strong>Type:</strong>
          {' '}
          {event.event_type}
        </li>
        <li>
          <strong>Date:</strong>
          {' '}
          {event.event_date}
        </li>
        <li>
          <strong>Title:</strong>
          {' '}
          {event.title}
        </li>
        <li>
          <strong>Speaker:</strong>
          {' '}
          {event.speaker}
        </li>
        <li>
          <strong>Host:</strong>
          {' '}
          {event.host}
        </li>
        <li>
          <strong>Published:</strong>
          {' '}
          {event.published ? 'yes' : 'no'}
        </li>
      </ul>
    </>
  );
};

Event.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      event_type: PropTypes.string.isRequired,
      event_date: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      speaker: PropTypes.string.isRequired,
      host: PropTypes.string.isRequired,
      published: PropTypes.bool.isRequired,
    }),
  ).isRequired,
};

export default Event;
```

+ [useParamsフック](https://reactrouterdotcom.fly.dev/docs/en/v6/hooks/use-params) <br>

## 05. イベントをクリッカブルにする

+ `app/javascript/components/EventList.js`を編集<br>

```js:EventList.js
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const EventList = ({ events }) => {
  const renderEvents = (eventArray) => {
    eventArray.sort((a, b) => new Date(b.event_date) - new Date(a.event_date));

    return eventArray.map((event) => (
      <li key={event.id}>
        <Link to={`/events/${event.id}`}>
          {event.event_date}
          {' - '}
          {event.event_type}
        </Link>
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
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      event_type: PropTypes.string,
      event_date: PropTypes.string,
      title: PropTypes.string,
      speaker: PropTypes.string,
      host: PropTypes.string,
      published: PropTypes.bool,
    }),
  ).isRequired,
};

export default EventList;
```

+ loacalhost:3000 から試してみる<br>

## 08. スタイルを追加する

+ `$ touch app/javascript/components/App.css`を実行<br>

+ `app/javascript/components/App.css`を編集<br>

```css:App.css
body,
html,
div,
blockquote,
img,
label,
p,
h1,
h2,
h3,
h4,
h5,
h6,
pre,
ul,
ol,
li,
dl,
dt,
dd,
form,
a,
fieldset,
input,
th,
td {
  margin: 0;
  padding: 0;
}

ul,
ol {
  list-style: none;
}

body {
  font-family: Roboto;
  font-size: 16px;
  line-height: 28px;
}

header {
  background: #f57011;
  height: 60px;
}

header h1,
header h1 a {
  display: inline-block;
  font-family: "Maven Pro";
  font-size: 28px;
  font-weight: 500;
  color: white;
  padding: 14px 5%;
  text-decoration: none;
}

header h1:hover {
  text-decoration: underline;
}

.grid {
  display: grid;
  grid-gap: 50px;
  grid-template-columns: minmax(250px, 20%) auto;
  margin: 25px auto;
  width: 90%;
  height: calc(100vh - 145px);
}

.eventList {
  background: #f6f6f6;
  padding: 16px;
}

.eventList h2 {
  font-size: 20px;
  padding: 8px 6px 10px;
}

.eventContainer {
  font-size: 15px;
  line-height: 35px;
}

.eventContainer h2 {
  margin-bottom: 10px;
}

.eventList li:hover,
a.active {
  background: #f8e5ce;
}

.eventList a {
  display: block;
  color: black;
  text-decoration: none;
  border-bottom: 1px solid #dddddd;
  padding: 8px 6px 10px;
  outline: 0;
}

.eventList h2>a {
  color: #236fff;
  font-size: 15px;
  float: right;
  font-weight: normal;
  border-bottom: none;
  padding: 0px;
}

.eventForm {
  margin-top: 15px;
}

label>strong {
  display: inline-block;
  vertical-align: top;
  text-align: right;
  width: 100px;
  margin-right: 6px;
  font-size: 15px;
}

input,
textarea {
  padding: 2px 0 3px 3px;
  width: 400px;
  margin-bottom: 15px;
  box-sizing: border-box;
}

input[type="checkbox"] {
  width: 13px;
}

button[type="submit"] {
  background: #f57011;
  border: none;
  padding: 5px 25px 8px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  margin: 10px 0 0 106px;
}

.errors {
  border: 1px solid red;
  border-radius: 5px;
  margin: 20px 0 35px 0;
  width: 513px;
}

.errors h3 {
  background: red;
  color: white;
  padding: 10px;
  font-size: 15px;
}

.errors ul li {
  list-style-type: none;
  margin: 0;
  padding: 8px 0 8px 10px;
  border-top: solid 1px pink;
  font-size: 12px;
  font-weight: 0.9;
}

button.delete {
  background: none !important;
  border: none;
  padding: 0 !important;
  margin-left: 10px;
  cursor: pointer;
  color: #236fff;
  font-size: 15px;
  font-weight: normal;
  text-decoration: none;
}

button.delete:hover {
  text-decoration: underline;
}

h2 a {
  color: #236fff;
  font-size: 15px;
  font-weight: normal;
  margin: 3px 12px 0 12px;
  text-decoration: none;
}

h2 a:hover {
  text-decoration: underline;
}

.form-actions a {
  color: #236fff;
  font-size: 15px;
  margin: 3px 12px 0 12px;
  text-decoration: none;
}

.form-actions a:hover {
  text-decoration: underline;
}

input.search {
  width: 92%;
  margin: 15px 2px;
  padding: 4px 0 6px 6px;
}

.loading {
  height: calc(100vh - 60px);
  display: grid;
  justify-content: center;
  align-content: center;
}
```

+ [A Beginners Guide to CSS Grid Layout — Medialoot](https://medialoot.com/blog/a-beginners-guide-to-css-grid-layout/) <br>

+ `app/javascript/components/App.js`を編集<br>

```js:App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Editor from './Editor';
import './App.css'; // 追加

const App = () => (
  <Routes>
    <Route path="events/*" element={<Editor />} />
  </Routes>
);

export default App;
```

+ `app/javascript/components/Editor.js`を編集<br>

```js:Editor.js
import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Event from './Event';
import EventList from './EventList';
import Header from './Header';

const Editor = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // eslint-disable-next-line no-undef
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
      <div className="grid"> // 編集
        {isError && <p>Something went wrong. Check the console.</p>}
        {isLoading ? (
          <p className="loading">Loading...</p> // 編集
        ) : (
          <>
            <EventList events={events} />

            <Routes>
              <Route path=":id" element={<Event events={events} />} />
            </Routes>
          </>
        )}
      </div>
    </>
  );
};

export default Editor;
```

+ `app/javascript/components/EventList,js`を編集<br>

```js:EventList.js
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const EventList = ({ events }) => {
  const renderEvents = (eventArray) => {
    eventArray.sort((a, b) => new Date(b.event_date) - new Date(a.event_date));

    return eventArray.map((event) => (
      <li key={event.id}>
        <Link to={`/events/${event.id}`}>
          {event.event_date}
          {' - '}
          {event.event_type}
        </Link>
      </li>
    ));
  };

  return (
    <section className="eventList"> // 編集
      <h2>Events</h2>
      <ul>{renderEvents(events)}</ul>
    </section>
  );
};

EventList.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      event_type: PropTypes.string,
      event_date: PropTypes.string,
      title: PropTypes.string,
      speaker: PropTypes.string,
      host: PropTypes.string,
      published: PropTypes.bool,
    }),
  ).isRequired,
};

export default EventList;
```

+ `app/javascript/components/Event.js`を編集<br>

```js:Event.js
import React from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

const Event = ({ events }) => {
  const { id } = useParams();
  const event = events.find((e) => e.id === Number(id));

  return (
    <div className="eventContainer"> // 編集
      <h2>
        {event.event_date}
        {' - '}
        {event.event_type}
      </h2>
      <ul>
        <li>
          <strong>Type:</strong>
          {' '}
          {event.event_type}
        </li>
        <li>
          <strong>Date:</strong>
          {' '}
          {event.event_date}
        </li>
        <li>
          <strong>Title:</strong>
          {' '}
          {event.title}
        </li>
        <li>
          <strong>Speaker:</strong>
          {' '}
          {event.speaker}
        </li>
        <li>
          <strong>Host:</strong>
          {' '}
          {event.host}
        </li>
        <li>
          <strong>Published:</strong>
          {' '}
          {event.published ? 'yes' : 'no'}
        </li>
      </ul>
    </div> // 編集
  );
};

Event.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      event_type: PropTypes.string.isRequired,
      event_date: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      speaker: PropTypes.string.isRequired,
      host: PropTypes.string.isRequired,
      published: PropTypes.bool.isRequired,
    }),
  ).isRequired,
};

export default Event;
```

+ `app/views/layouts/application.html.erb`を編集<br>

```html:application.html.erb
<!DOCTYPE html>
<html>

<head>
  <title>EventManager</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <%= csrf_meta_tags %>
  <%= csp_meta_tag %>

  <!-- 追加 -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Maven+Pro:wght@400;500;700&family=Roboto:ital,wght@0,300;0,400;0,700;1,400&display=swap"
    rel="stylesheet">
  <!-- ここまで -->

  <%= stylesheet_pack_tag "application" %> <!-- 編集 -->
  <%= javascript_pack_tag "application" %>
</head>

<body>
  <%= yield %>
</body>

</html>
```

## JavaScript Bundler固有の設定(Shakapackerの場合)

+ `$ yarn add css-loader style-loader mini-css-extract-plugin css-minimizer-webpack-plugin`を実行<br>

+ 念のためサーバーを再起動する<br>

+ localhost:3000 にアクセスしてみる(cssが反映されていればOK)
