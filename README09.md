## 19. 404のコンポーネントを追加する

+ `$ touch app/javascript/components/EventNotFound.js`を実行<br>

+ `app/javascript/components/EventNotFound.js`を編集<br>

```js:EventNotFound.js
import React from 'react';

const EventNotFound = () => (
  <p>Event not found!</p>
);

export default EventNotFound;
```

+ `app/javascript/components/Event.js`を編集<br>

```js:Event.js
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import EventNotFound from './EventNotFound'; // 追加

const Event = ({ events, onDelete }) => {
  const { id } = useParams();
  const event = events.find((e) => e.id === Number(id));

  if (!event) return <EventNotFound />; // 追加

  return (
    <div className="eventContainer">
      <h2>
        {event.event_date}
        {' - '}
        {event.event_type}
        <Link to={`/events/${event.id}/edit`}>Edit</Link>
        <button
          className="delete"
          type="button"
          onClick={() => onDelete(event.id)}
        >
          Delete
        </button>
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

+ `app/javascript/components/EventForm.js`を編集<br>

```js:EventForm.js
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import Pikaday from 'pikaday';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import { isEmptyObject, validateEvent, formatDate } from '../helpers/helpers';
import 'pikaday/css/pikaday.css';
import EventNotFound from './EventNotFound';

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

  const cancelURL = event.id ? `events/${event.id}` : '/events';
  const title = event.id ? `${event.event_date} - ${event.event_type}` : 'New Event';

  if (id && !event.id) return <EventNotFound />; // 追加

  return (
    <section>
      <h2>{title}</h2>
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
              value={event.host}
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
          <Link to={cancelURL}>Cancel</Link>
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

+ http://localhost:3000/events/10 にアクセスしてみる<br>

------------------- END ---------------------