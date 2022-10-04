## 09. 選択したイベントをハイライトする

+ `app/javascript/components/EventList.js`を編集<br>

```js:EventList.js
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const EventList = ({ events }) => {
  const renderEvents = (eventArray) => {
    eventArray.sort((a, b) => new Date(b.event_date) - new Date(a.event_date));

    return eventArray.map((event) => (
      <li key={event.id}>
        <NavLink to={`/events/${event.id}`}> // 編集
          {event.event_date}
          {' - '}
          {event.event_type}
        </NavLink> // 編集
      </li>
    ));
  };

  return (
    <section className="eventList">
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

## イベントを作成する

+ `$ touch app/javascript/components/EventForm.jsx`を実行<br>

+ `app/javascript/components/Editor.js`を編集<br>

```js:Editor.js
import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Event from './Event';
import EventForm from './EventForm';
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
      <div className="grid">
        {isError && <p>Something went wrong. Check the console.</p>}
        {isLoading ? (
          <p className="loading">Loading...</p>
        ) : (
          <>
            <EventList events={events} />

            <Routes>
              <Route path="new" element={<EventForm />} /> // 追加
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

+ `app/javascript/components/EventList.js`を編集<br>

```js:EventList.js
import React from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';

const EventList = ({ events }) => {
  const renderEvents = (eventArray) => {
    eventArray.sort((a, b) => new Date(b.event_date) - new Date(a.event_date));

    return eventArray.map((event) => (
      <li key={event.id}>
        <NavLink to={`/events/${event.id}`}>
          {event.event_date}
          {' - '}
          {event.event_type}
        </NavLink>
      </li>
    ));
  };

  return (
    <section className="eventList">
      <h2>
        Events
        <Link to="/events/new">New Event</Link> // 追加
      </h2>
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

+ `app/javascript/components/EventForm.jsx`を編集<br>

```jsx:EventForm.jsx
import React from 'react';

const EventForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted');
  };

  return (
    <section>
      <form className="eventForm" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="event_type">
            <strong>Type:</strong>
            <input type="text" id="event_type" name="event_type" />
          </label>
        </div>
        <div>
          <label htmlFor="event_date">
            <strong>Date:</strong>
            <input type="text" id="event_date" name="event_date" />
          </label>
        </div>
        <div>
          <label htmlFor="title">
            <strong>Title:</strong>
            <textarea id="title" name="title" cols="30" rows="10" />
          </label>
        </div>
        <div>
          <label htmlFor="speaker">
            <strong>Speakers:</strong>
            <input type="text" id="speaker" name="speaker" />
          </label>
        </div>
        <div>
          <label htmlFor="host">
            <strong>Speakers:</strong>
            <input type="text" id="host" name="host" />
          </label>
        </div>
        <div>
          <label htmlFor="published">
            <strong>Publish:</strong>
            <input type="checkbox" id="published" name="published" />
          </label>
        </div>
        <div className="form-actions">
          <button type="submit">Save</button>
        </div>
      </form>
    </section>
  );
};
export default EventForm;
```

+ http://localhost:3000/events/new にアクセスしてみて `Save`をクリックし、console.logが正常に表示されていればOK <br>

## 10. フォームのバリデーション

+ `app/javascript/components/EventForm.jsx`を編集<br>

```jsx:EventForm.jsx
import React, { useState } from 'react';

const EventForm = () => {
  // 追加
  const [event, setEvent] = useState({
    event_type: '',
    event_date: '',
    title: '',
    speaker: '',
    host: '',
    published: false,
  });

  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { target } = e;
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    setEvent({ ...event, [name]: value });
  };

  const validateEvent = () => {
    const errors = {};

    if (event.event_type === '') {
      errors.event_type = 'You maut enter an event type';
    }
    if (event.event_date === '') {
      errors.event_date = 'You maut enter an event date';
    }
    if (event.title === '') {
      errors.title = 'You maut enter an title';
    }
    if (event.speaker === '') {
      errors.speaker = 'You maut enter an event speaker';
    }
    if (event.host === '') {
      errors.host = 'You maut enter an host';
    }

    return errors;
  };

  const isEmptyObject = (obj) => Object.keys(obj).length === 0;

  const renderErrors = () => {
    if (isEmptyObject(formErrors)) {
      return null;
    }

    return (
      <div className="errors">
        <h3>The following errors prohibited the event from being saved:</h3>
        <ul>
          {Object.values(formErrors).map((formError) => (
            <li key={formError}>{formError}</li>
          ))}
        </ul>
      </div>
    );
  };
  // ここまで

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateEvent(event); // 追加

    // 追加
    if (!isEmptyObject(errors)) {
      setFormErrors(errors);
    } else {
      console.log(event);
    }
  };
  // ここまで

  return (
    <section>
      // 追加
      {renderErrors()}

      <form className="eventForm" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="event_type">
            <strong>Type:</strong>
            <input
              type="text"
              id="event_type"
              name="event_type"
              onChange={handleInputChange} // 追加
            />
          </label>
        </div>
        <div>
          <label htmlFor="event_date">
            <strong>Date:</strong>
            <input
              type="text"
              id="event_date"
              name="event_date"
              onChange={handleInputChange} // 追加
            />
          </label>
        </div>
        <div>
          <label htmlFor="title">
            <strong>Title:</strong>
            <textarea
              id="title"
              name="title"
              cols="30"
              rows="10"
              onChange={handleInputChange} // 追加
            />
          </label>
        </div>
        <div>
          <label htmlFor="speaker">
            <strong>Speakers:</strong>
            <input
              type="text"
              id="speaker"
              name="speaker"
              onChange={handleInputChange} // 追加
            />
          </label>
        </div>
        <div>
          <label htmlFor="host">
            <strong>Speakers:</strong>
            <input
              type="text"
              id="host"
              name="host"
              onChange={handleInputChange} // 追加
            />
          </label>
        </div>
        <div>
          <label htmlFor="published">
            <strong>Publish:</strong>
            <input
              type="checkbox"
              id="published"
              name="published"
              onChange={handleInputChange} // 追加
            />
          </label>
        </div>
        <div className="form-actions">
          <button type="submit">Save</button>
        </div>
      </form>
    </section>
  );
};
export default EventForm;
```

```
最初に、ステートに2つの変数eventとformErrorsを定義します。
event変数はオブジェクトとしていくつかの妥当なデフォルト値で初期化され、formErrorsは空オブジェクトとして初期化されます。

次はhandleInputChange関数です。このフォーム内のすべてのフィールドは「制御された入力」にする（つまりフィールドのステートの維持や設定はReactが行う）ことにします。

ユーザーがどのフィールドの値を変更しても、そのたびにhandleInputChange関数が呼び出されてeventオブジェクトが更新され、フォームへの入力がeventオブジェクトに反映されます。nameなどの変数をオブジェクトのキーとして扱うには、[name]のように角かっこで囲む点にご注意ください。

次はヘルパー関数validateEventとisEmptyObjectです。

1つ目のvalidateEvent関数は、eventオブジェクトに対して多くのチェックを実行し、エラーの場合はエラーを含むオブジェクトを返します。
2つ目のisEmptyObject関数は、渡されたオブジェクトにプロパティが存在するかどうかをtrueまたはfalseで返します。

次のrenderErrors関数は、formErrorsオブジェクトが空の場合はnullを返し、そうでない場合は、保存できないという警告とエラーリストをJSXで返します。

最後はhandleSubmit関数を更新して、ユーザー入力をバリデーション（および各フィールドに値が存在していることもチェック）し、不足がある場合はエラーメッセージを、正常な場合は有効なイベントをブラウザコンソールにログ出力します。なお、JSXも少し更新してフォームのすべての入力にonChangeプロパティを追加してあります。
```