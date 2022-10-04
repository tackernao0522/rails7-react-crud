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
