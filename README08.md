## 17. フォームにさらに手を加える

+ `app/javascript/components/EventForm.jsx`を編集<br>

```js:EventForm.jsx
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import Pikaday from 'pikaday';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import { isEmptyObject, validateEvent, formatDate } from '../helpers/helpers';
import 'pikaday/css/pikaday.css';

const EventForm = ({ events, onSave }) => {
  const { id } = useParams();
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

  // 追加
  const cancelURL = event.id ? `events/${event.id}` : '/events';
  const title = event.id ? `${event.event_date} - ${event.event_type}` : 'New Event';
  // ここまで

  return (
    <section>
      <h2>{title}</h2> // 編集
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
              value={event.host} // 追加
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
          <Link to={cancelURL}>Cancel</Link> // 追加
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

+ `app/javascript/helpers/helpers.js`を編集<br>

```js:helper.js
import { error } from './notifications';

export const isEmptyObject = (obj) => Object.keys(obj).length === 0;

const isValidDate = (dateObj) => !Number.isNaN(Date.parse(dateObj));

export const validateEvent = (event) => {
  const errors = {};

  if (event.event_type === '') {
    errors.event_type = 'You maut enter an event type';
  }
  if (event.event_date === '') {
    errors.event_date = 'You maut enter an event date';
  }
  // 追加
  if (!isValidDate(event.event_date)) {
    errors.event_date = 'You must enter a valid date';
  }
  // ここまで
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

export const handleAjaxError = (err) => {
  error('Something went wrong');
  console.error(err);
};
```

+ `app/javascript/components/Header.js`を編集<br>

```js:Header.js
import React from 'react';
import { Link } from 'react-router-dom'; // 追加

const Header = () => (
  <header>
    <Link to="/events"> // 追加
      <h1>Event Manager</h1>
    </Link> // 追加
  </header>
);

export default Header;
```