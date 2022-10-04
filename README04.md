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
