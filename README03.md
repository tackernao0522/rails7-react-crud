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