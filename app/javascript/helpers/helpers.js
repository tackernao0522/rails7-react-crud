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
