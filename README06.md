## 13. イベントを保存する

+ `app/javascript/components/Editor.js`を編集<br>

```js:Editor.js
import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom'; // 編集
import Event from './Event';
import EventForm from './EventForm';
import EventList from './EventList';
import Header from './Header';

const Editor = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate(); // 追加

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

  // 追加
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
      // eslint-disable-next-line no-undef
      window.alert('Event Added!');
      navigate(`/events/${savedEvent.id}`);
    } catch (error) {
      console.log(error);
    }
  };
  // ここまで

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
              <Route path="new" element={<EventForm onSave={addEvent} />} /> // 編集
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

+ `app/javascript/components/EventForm.jsx`を編集<br>

```jsx:EventForm.jsx
import React, { useEffect, useRef, useState } from 'react';
import Pikaday from 'pikaday';
import PropTypes from 'prop-types'; // 追加
import { isEmptyObject, validateEvent, formatDate } from '../helpers/helpers';
import 'pikaday/css/pikaday.css';

const EventForm = ({ onSave }) => { // 編集
  const [event, setEvent] = useState({
    event_type: '',
    event_date: '',
    title: '',
    speaker: '',
    host: '',
    published: false,
  });

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
      onSave(event); // 編集
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

// 追加
EventForm.propTypes = {
  onSave: PropTypes.func.isRequired,
};
// ここまで
```

+ イベントが保存されるかどうか確認する<br>

## 14. イベントを削除する

+ `app/javascript/components/Editor.js`を編集<br>

```js:Editor.js
import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
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
      // eslint-disable-next-line no-undef
      window.alert('Event Added!');
      navigate(`/events/${savedEvent.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  // 追加
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

        // eslint-disable-next-line no-undef
        window.alert('Event Deleted!');
        navigate('/events');
        setEvents(events.filter((event) => event.id !== eventId));
      } catch (error) {
        console.log(error);
      }
    }
  };
  // ここまで

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
              <Route path=":id" element={<Event events={events} onDelete={deleteEvent} />} /> // 編集
            </Routes>
          </>
        )}
      </div>
    </>
  );
};

export default Editor;
```

+ `app/javascript/components/Event.js`を編集<br>

```js:Event.js
import React from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

const Event = ({ events, onDelete }) => { // 編集
  const { id } = useParams();
  const event = events.find((e) => e.id === Number(id));

  return (
    <div className="eventContainer">
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
          // 追加
          <button
            className="delete"
            type="button"
            onClick={() => onDelete(event.id)}
          >
            Delete
          </button>
          // ここまで
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
  onDelete: PropTypes.func.isRequired, // 追加
};

export default Event;
```

+ イベントを削除できるかどうか確認する<br>
