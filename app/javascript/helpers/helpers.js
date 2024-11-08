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
  if (!isValidDate(event.event_date)) {
    errors.event_date = 'You must enter a valid date';
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

export const handleAjaxError = (err) => {
  error('Something went wrong');
  console.error(err);
};
