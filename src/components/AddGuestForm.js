import React from 'react';
import PropTypes from 'prop-types';

/**
 * AddGuestForm component for adding new guests
 * @param {Object} props - Component props
 * @param {string} props.value - Current input value
 * @param {Function} props.onSubmit - Form submit handler
 * @param {Function} props.onChange - Input change handler
 * @param {string} props.error - Validation error message
 */
const AddGuestForm = ({ value, onSubmit, onChange, error = '' }) => {
  return (
    <form onSubmit={onSubmit} noValidate>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Invite Someone"
        aria-label="Guest name"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? 'guest-name-error' : undefined}
        required
        minLength={2}
        maxLength={50}
      />
      <button type="submit" name="submit" value="submit">Submit</button>
      {error && (
        <div
          id="guest-name-error"
          role="alert"
          aria-live="polite"
          className="error-message"
        >
          {error}
        </div>
      )}
    </form>
  );
};

AddGuestForm.propTypes = {
  value: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string
};

export default AddGuestForm;
