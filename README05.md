## 11. ヘルパー関数を作成する

+ `$ mkdir app/javascript/helpers && touch $_/helpers.js`を実行<br>

+ `app/javascript/helpers/helpers.js`を編集<br>

(EventForm.jsx) から下記コードをカットしてペーストする<br>

```js:helpers.js
export const isEmptyObject = (obj) => Object.keys(obj).length === 0; // 上に移動 exportを追記

export const validateEvent = (event) => { // 編集 eventとexportを追記
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
```

+ `app/javascript/components/EventForm.jsx`を編集<br>

```jsx:EventForm.jsx
import React, { useState } from 'react';
import { isEmptyObject, validateEvent } from '../helpers/helpers'; // 追加

const EventForm = () => {
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
      console.log(event);
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
```

+ http://localhost:3000/events/new にアクセスしてエラー出るか確認してみる<br>
