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