## 15. Flashメッセージを追加する

[React-Toastify](https://www.npmjs.com/package/react-toastify) <br>

+ `$ yarn add react-toastify`を実行<br>

+ `$ touch app/javascript/helpers/notifications.js`を実行<br>

+ `app/javascript/helpers/notifications.js`を編集<br>

```js:notifications.js
import { Flip, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaults = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  transition: Flip,
};

export const success = (message, options = {}) => {
  toast.success(message, Object.assign(defaults, options));
};

export const info = (message, options = {}) => {
  toast.info(message, Object.assign(defaults, options));
};

export const warn = (message, options = {}) => {
  toast.warn(message, Object.assign(defaults, options));
};

export const error = (message, options = {}) => {
  toast.error(message, Object.assign(defaults, options));
};
```

[playground](https://fkhadra.github.io/react-toastify/introduction/) <br>

[トランジション](https://fkhadra.github.io/react-toastify/replace-default-transition/) <br>

+ `app/javascript/components/App.js`を編集<br>

```js:App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // 追加
import Editor from './Editor';
import './App.css';

const App = () => (
  <>
    <Routes>
      <Route path="events/*" element={<Editor />} />
    </Routes>
    <ToastContainer /> // 追加
  </>
);

export default App;
```

[ToastContainer](https://fkhadra.github.io/react-toastify/api/toast-container) <br>

+ `app/javascript/components/Editor.js`を編集<br>

```js:Editor.js
import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { success } from '../helpers/notifications';
import Event from './Event';
import EventForm from './EventForm';
import EventList from './EventList';
import Header from './Header';

const Editor = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

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

  const addEvent = async (newEvent) => {
    try {
      // eslint-disable-next-line no-undef
      const response = await window.fetch('/api/events', {
        method: 'POST',
        body: JSON.stringify(newEvent),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw Error(response.statusText);

      const savedEvent = await response.json();
      const newEvents = [...events, savedEvent];
      setEvents(newEvents);
      success('Event Added!'); // 編集
      navigate(`/events/${savedEvent.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteEvent = async (eventId) => {
    // eslint-disable-next-line no-undef
    const sure = window.confirm('Are you sure?');

    if (sure) {
      try {
        // eslint-disable-next-line no-undef
        const response = await window.fetch(`/api/events/${eventId}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw Error(response.statusText);
        success('Event Deleted!'); // 編集
        navigate('/events');
        setEvents(events.filter((event) => event.id !== eventId));
      } catch (error) {
        console.log(error);
      }
    }
  };

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
              <Route path="new" element={<EventForm onSave={addEvent} />} />
              <Route path=":id" element={<Event events={events} onDelete={deleteEvent} />} />
            </Routes>
          </>
        )}
      </div>
    </>
  );
};

export default Editor;
```

+ `app/javascript/helpers/helpers.js`を編集<br>

```js:helpoers.js
import { error } from './notifications'; // 追加

export const isEmptyObject = (obj) => Object.keys(obj).length === 0;

export const validateEvent = (event) => {
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

export const formatDate = (d) => {
  const YYYY = d.getFullYear();
  const MM = `0${d.getMonth() + 1}`.slice(-2);
  const DD = `0${d.getDate()}`.slice(-2);

  return `${YYYY}-${MM}-${DD}`;
};

// 追加
export const handleAjaxError = (err) => {
  error('Something went wrong');
  console.error(err);
};
// ここまで
```

+ `app/javascript/components/Editor.js`を編集<br>

```js:Editor.js
import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { handleAjaxError } from '../helpers/helpers';
import { success } from '../helpers/notifications';
import Event from './Event';
import EventForm from './EventForm';
import EventList from './EventList';
import Header from './Header';

const Editor = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [isError, setIsError] = useState(false); 削除する
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // eslint-disable-next-line no-undef
        const response = await window.fetch('/api/events');
        if (!response.ok) throw Error(response.statusText);
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        // setIsError(true); 削除する
        handleAjaxError(error);
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const addEvent = async (newEvent) => {
    try {
      // eslint-disable-next-line no-undef
      const response = await window.fetch('/api/events', {
        method: 'POST',
        body: JSON.stringify(newEvent),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw Error(response.statusText);

      const savedEvent = await response.json();
      const newEvents = [...events, savedEvent];
      setEvents(newEvents);
      success('Event Added!');
      navigate(`/events/${savedEvent.id}`);
    } catch (error) {
      handleAjaxError(error);
    }
  };

  const deleteEvent = async (eventId) => {
    // eslint-disable-next-line no-undef
    const sure = window.confirm('Are you sure?');

    if (sure) {
      try {
        // eslint-disable-next-line no-undef
        const response = await window.fetch(`/api/events/${eventId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw Error(response.statusText);
        success('Event Deleted!');
        navigate('/events');
        setEvents(events.filter((event) => event.id !== eventId));
      } catch (error) {
        handleAjaxError(error);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="grid">
        // {isError && <p>Something went wrong. Check the console.</p>} 削除する
        {isLoading ? (
          <p className="loading">Loading...</p>
        ) : (
          <>
            <EventList events={events} />

            <Routes>
              <Route path="new" element={<EventForm onSave={addEvent} />} />
              <Route path=":id" element={<Event events={events} onDelete={deleteEvent} />} />
            </Routes>
          </>
        )}
      </div>
    </>
  );
};

export default Editor;
```

+ 新規追加と削除でトーストが表示されるか確認してみる<br>

## 16. Update Events

+ `app/javascript/components/Event.js`を編集<br>

```js:Event.js
import React from 'react';
import { Link, useParams } from 'react-router-dom'; // 編集
import PropTypes from 'prop-types';

const Event = ({ events, onDelete }) => {
  const { id } = useParams();
  const event = events.find((e) => e.id === Number(id));

  return (
    <div className="eventContainer">
      <h2>
        {event.event_date}
        {' - '}
        {event.event_type}
        // 追加
        <Link to={`/events/${event.id}/edit`}>Edit</Link>
        <button
          className="delete"
          type="button"
          onClick={() => onDelete(event.id)}
        >
          Delete
        </button>
        // ここまで
      </h2>
      <ul>
        <li>
          <strong>Type:</strong>
          {' '}
          {event.event_type}
          <button
            className="delete"
            type="button"
            onClick={() => onDelete(event.id)}
          >
            Delete
          </button>
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
    </div>
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
  onDelete: PropTypes.func.isRequired,
};

export default Event;
```

+ `app/javascript/components/Editor.js`を編集<br>

```js:Editor.js
import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { handleAjaxError } from '../helpers/helpers';
import { success } from '../helpers/notifications';
import Event from './Event';
import EventForm from './EventForm';
import EventList from './EventList';
import Header from './Header';

const Editor = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // eslint-disable-next-line no-undef
        const response = await window.fetch('/api/events');
        if (!response.ok) throw Error(response.statusText);
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        handleAjaxError(error);
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const addEvent = async (newEvent) => {
    try {
      // eslint-disable-next-line no-undef
      const response = await window.fetch('/api/events', {
        method: 'POST',
        body: JSON.stringify(newEvent),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw Error(response.statusText);

      const savedEvent = await response.json();
      const newEvents = [...events, savedEvent];
      setEvents(newEvents);
      success('Event Added!');
      navigate(`/events/${savedEvent.id}`);
    } catch (error) {
      handleAjaxError(error);
    }
  };

  const deleteEvent = async (eventId) => {
    // eslint-disable-next-line no-undef
    const sure = window.confirm('Are you sure?');

    if (sure) {
      try {
        // eslint-disable-next-line no-undef
        const response = await window.fetch(`/api/events/${eventId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw Error(response.statusText);
        success('Event Deleted!');
        navigate('/events');
        setEvents(events.filter((event) => event.id !== eventId));
      } catch (error) {
        handleAjaxError(error);
      }
    }
  };

  // 追加
  const updateEvent = async (updatedEvent) => {
    try {
      // eslint-disable-next-line no-undef
      const response = await window.fetch(`/api/events/${updateEvent.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedEvent),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw Error(response.statusText);

      const newEvents = events;
      const idx = newEvents.findIndex((event) => event.id === updatedEvent.id);
      newEvents[idx] = updatedEvent;
      setEvents(newEvents);

      success('Event updated!');
      navigate(`/events/${updatedEvent.id}`);
    } catch (error) {
      handleAjaxError(error);
    }
  };
  // ここまで

  return (
    <>
      <Header />
      <div className="grid">
        {isLoading ? (
          <p className="loading">Loading...</p>
        ) : (
          <>
            <EventList events={events} />

            <Routes>
              // 編集
              <Route
                path=":id"
                element={<Event events={events} onDelete={deleteEvent} />}
              />
              <Route
                path=":id"
                element={<Event events={events} onSave={updateEvent} />}
              />
              <Route path="new" element={<EventForm onSave={addEvent} />} />
              // ここまで
            </Routes>
          </>
        )}
      </div>
    </>
  );
};

export default Editor;
```

+ `app/javascript/components/EventForm.jsx`を編集<br>

```jsx:EventForm.jsx
import React, { useEffect, useRef, useState } from 'react';
import Pikaday from 'pikaday';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom'; // 追加
import { isEmptyObject, validateEvent, formatDate } from '../helpers/helpers';
import 'pikaday/css/pikaday.css';

const EventForm = ({ events, onSave }) => { // 編集
  const { id } = useParams(); // 追加

  // 追加
  const defaults = {
    event_type: '',
    event_date: '',
    title: '',
    speaker: '',
    host: '',
    published: false,
  };

  const currEvent = id ? events.find((e) => e.id === Number(id)) : {};
  const initialEventState = { ...defaults, ...currEvent };
  const [event, setEvent] = useState(initialEventState);
  // ここまで
  const [formErrors, setFormErrors] = useState({});

  const dateInput = useRef(null);

  const updateEvent = (key, value) => {
    setEvent((prevEvent) => ({
      ...prevEvent,
      [key]: value,
    }));
  };

  useEffect(() => {
    const p = new Pikaday({
      field: dateInput.current,
      onSelect: (date) => {
        const formattedDate = formatDate(date);
        dateInput.current.value = formattedDate;
        updateEvent('event_date', formattedDate);
      },
    });

    // クリーンアップ用の関数を返す
    // Reactはアンマウントの前にこれを呼び出す
    return () => p.destroy();
  }, []);

  const handleInputChange = (e) => {
    const { target } = e;
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    updateEvent(name, value);
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateEvent(event);

    if (!isEmptyObject(errors)) {
      setFormErrors(errors);
    } else {
      onSave(event);
    }
  };

  return (
    <section>
      {renderErrors()}

      <form className="eventForm" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="event_type">
            <strong>Type:</strong>
            <input
              type="text"
              id="event_type"
              name="event_type"
              onChange={handleInputChange}
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
              ref={dateInput}
              autoComplete="off"
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label htmlFor="host">
            <strong>Hosts:</strong>
            <input
              type="text"
              id="host"
              name="host"
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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

EventForm.propTypes = {
  onSave: PropTypes.func.isRequired,
};
```

```
ここでは、URLから得た現在のイベントのIDをReact RouterのuseParamsフックで取得しています。このIDは整数値か、undefinedになります（フォームで新規イベントを作成する場合）。続いて、イベントフィールドのデフォルト値を宣言します。

次に、id変数の値をチェックします。undefined（新規イベント作成）の場合は、currEventに空オブジェクトを設定します。それ以外の場合は、イベントの配列をフィルタして更新対象のイベントを検索し、currEventの値に設定します。

次に、defaultsとcurrEventをマージしてinitialEventStateという新しい変数を作成し、それからステートのeventプロパティを宣言してinitialEventStateの値で初期化します。

ここにはイベントのeffectがあり、いくつかの適切なデフォルト値または編集対象イベントの値で初期化されます。

この方法は少し込み入っているように見えるかもしれません（理想としては、<EventForm>コンポーネントに表示する必要のあるイベントだけを渡せればよかったのです）。しかし、React Routerがバージョン6にアップグレードされてからは、親コンポーネント内の:idプロパティを参照する方法が見当たらなくなってしまいました。方法について心当たりのある方は、ぜひ元記事のコメントでお知らせください。

次に、eventから得た正しい値でフォームが初期化されるようにする必要があります。また、コンポーネントのプロパティバリデーションを更新する必要もあります。
```

+ `app/javascript/components/EventForm.jsx`を編集<br>

```jsx:EventForm.jsx
import React, { useEffect, useRef, useState } from 'react';
import Pikaday from 'pikaday';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { isEmptyObject, validateEvent, formatDate } from '../helpers/helpers';
import 'pikaday/css/pikaday.css';

const EventForm = ({ events, onSave }) => {
  const { id } = useParams();

  const defaults = {
    event_type: '',
    event_date: '',
    title: '',
    speaker: '',
    host: '',
    published: false,
  };

  const currEvent = id ? events.find((e) => e.id === Number(id)) : {};
  const initialEventState = { ...defaults, ...currEvent };
  const [event, setEvent] = useState(initialEventState);
  const [formErrors, setFormErrors] = useState({});

  const dateInput = useRef(null);

  const updateEvent = (key, value) => {
    setEvent((prevEvent) => ({
      ...prevEvent,
      [key]: value,
    }));
  };

  useEffect(() => {
    const p = new Pikaday({
      field: dateInput.current,
      onSelect: (date) => {
        const formattedDate = formatDate(date);
        dateInput.current.value = formattedDate;
        updateEvent('event_date', formattedDate);
      },
    });

    // クリーンアップ用の関数を返す
    // Reactはアンマウントの前にこれを呼び出す
    return () => p.destroy();
  }, []);

  const handleInputChange = (e) => {
    const { target } = e;
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    updateEvent(name, value);
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateEvent(event);

    if (!isEmptyObject(errors)) {
      setFormErrors(errors);
    } else {
      onSave(event);
    }
  };

  return (
    <section>
      // 編集
      <h2>New Event</h2>
      {renderErrors()}

      <form className="eventForm" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="event_type">
            <strong>Type:</strong>
            <input
              type="text"
              id="event_type"
              name="event_type"
              onChange={handleInputChange}
              value={event.event_type}
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
              ref={dateInput}
              autoComplete="off"
              value={event.event_date}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              value={event.title}
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
              onChange={handleInputChange}
              value={event.speaker}
            />
          </label>
        </div>
        <div>
          <label htmlFor="host">
            <strong>Hosts:</strong>
            <input
              type="text"
              id="host"
              name="host"
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              checked={event.published}
            />
          </label>
        </div>
        <div className="form-actions">
          <button type="submit">Save</button>
        </div>
      </form>
    </section>
  );
  // ここまで
};
export default EventForm;

// 編集
EventForm.propTypes = {
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
  ),
  onSave: PropTypes.func.isRequired,
};

EventForm.defaultProps = {
  events: [],
};
// ここまで
```

+ `app/javascript/components/EventForm.jsx`を編集<br>

```jsx:EventForm.jsx
import React, { useEffect, useRef, useState } from 'react';
import Pikaday from 'pikaday';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { isEmptyObject, validateEvent, formatDate } from '../helpers/helpers';
import 'pikaday/css/pikaday.css';

const EventForm = ({ events, onSave }) => {
  const { id } = useParams();

  const defaults = {
    event_type: '',
    event_date: '',
    title: '',
    speaker: '',
    host: '',
    published: false,
  };

  const currEvent = id ? events.find((e) => e.id === Number(id)) : {};
  const initialEventState = { ...defaults, ...currEvent };
  const [event, setEvent] = useState(initialEventState);
  const [formErrors, setFormErrors] = useState({});

  const dateInput = useRef(null);

  const updateEvent = (key, value) => {
    setEvent((prevEvent) => ({
      ...prevEvent,
      [key]: value,
    }));
  };

  useEffect(() => {
    const p = new Pikaday({
      field: dateInput.current,
      toString: (date) => formatDate(date), // 追加
      onSelect: (date) => {
        const formattedDate = formatDate(date);
        dateInput.current.value = formattedDate;
        updateEvent('event_date', formattedDate);
      },
    });

    // クリーンアップ用の関数を返す
    // Reactはアンマウントの前にこれを呼び出す
    return () => p.destroy();
  }, []);

  const handleInputChange = (e) => {
    const { target } = e;
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    updateEvent(name, value);
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateEvent(event);

    if (!isEmptyObject(errors)) {
      setFormErrors(errors);
    } else {
      onSave(event);
    }
  };

  return (
    <section>
      <h2>New Event</h2>
      {renderErrors()}

      <form className="eventForm" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="event_type">
            <strong>Type:</strong>
            <input
              type="text"
              id="event_type"
              name="event_type"
              onChange={handleInputChange}
              value={event.event_type}
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
              ref={dateInput}
              autoComplete="off"
              value={event.event_date}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              value={event.title}
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
              onChange={handleInputChange}
              value={event.speaker}
            />
          </label>
        </div>
        <div>
          <label htmlFor="host">
            <strong>Hosts:</strong>
            <input
              type="text"
              id="host"
              name="host"
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              checked={event.published}
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

EventForm.propTypes = {
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
  ),
  onSave: PropTypes.func.isRequired,
};

EventForm.defaultProps = {
  events: [],
};
```

[componentWillReceiveProps](https://ja.reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops) <br>

[useCallbackフック](https://ja.reactjs.org/docs/hooks-reference.html#usecallback) <br>

+ `app/javascript/components/EventForm.jsx`を編集<br>

```jsx:EventForm.jsx
// ここから削除
const defaults = {
  event_type: '',
  event_date: '',
  title: '',
  speaker: '',
  host: '',
  published: false,
};
const currEvent = id ? events.find((e) => e.id === Number(id)) : {};
const initialEventState = { ...defaults, ...currEvent };
// ここまで
```

+ `app/javascript/components/EventForm.jsx`を編集<br>

```jsx:EventForm.jsx
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react'; // 編集
import Pikaday from 'pikaday';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { isEmptyObject, validateEvent, formatDate } from '../helpers/helpers';
import 'pikaday/css/pikaday.css';

const EventForm = ({ events, onSave }) => {
  const { id } = useParams();
  // 編集
  const initialEventState = useCallback(() => {
    const defaults = {
      event_type: '',
      event_date: '',
      title: '',
      speaker: '',
      host: '',
      published: false,
    };

    const currEvent = id ? events.find((e) => e.id === Number(id)) : {};

    return { ...defaults, ...currEvent };
  }, [events, id]);
  // ここまで

  const [event, setEvent] = useState(initialEventState);
  const [formErrors, setFormErrors] = useState({});

  const dateInput = useRef(null);

  const updateEvent = (key, value) => {
    setEvent((prevEvent) => ({
      ...prevEvent,
      [key]: value,
    }));
  };

  useEffect(() => {
    const p = new Pikaday({
      field: dateInput.current,
      toString: (date) => formatDate(date),
      onSelect: (date) => {
        const formattedDate = formatDate(date);
        dateInput.current.value = formattedDate;
        updateEvent('event_date', formattedDate);
      },
    });

    // クリーンアップ用の関数を返す
    // Reactはアンマウントの前にこれを呼び出す
    return () => p.destroy();
  }, []);

  useEffect(() => {
    setEvent(initialEventState);
  }, [events, initialEventState]);

  const handleInputChange = (e) => {
    const { target } = e;
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    updateEvent(name, value);
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateEvent(event);

    if (!isEmptyObject(errors)) {
      setFormErrors(errors);
    } else {
      onSave(event);
    }
  };

  return (
    <section>
      <h2>New Event</h2>
      {renderErrors()}

      <form className="eventForm" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="event_type">
            <strong>Type:</strong>
            <input
              type="text"
              id="event_type"
              name="event_type"
              onChange={handleInputChange}
              value={event.event_type}
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
              ref={dateInput}
              autoComplete="off"
              value={event.event_date}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              value={event.title}
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
              onChange={handleInputChange}
              value={event.speaker}
            />
          </label>
        </div>
        <div>
          <label htmlFor="host">
            <strong>Hosts:</strong>
            <input
              type="text"
              id="host"
              name="host"
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              checked={event.published}
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

EventForm.propTypes = {
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
  ),
  onSave: PropTypes.func.isRequired,
};

EventForm.defaultProps = {
  events: [],
};
```

[フックに関するよくある質問 – React](https://ja.reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) <br>
