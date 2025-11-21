import React from 'react';
import PropTypes from 'prop-types';

/**
 * AddGuestForm component for adding new guests
 * Memoized to optimize re-renders
 * @param {Object} props - Component props
 * @param {string} props.value - Current input value
 * @param {Function} props.onSubmit - Form submit handler
 * @param {Function} props.onChange - Input change handler
 * @param {string} props.error - Validation error message
 * @param {React.RefObject} props.inputRef - Ref for the input element
 */
const AddGuestForm = React.memo(({ value, onSubmit, onChange, error = '', inputRef }) => {
  return (
    <form onSubmit={onSubmit} noValidate>
      <input
        ref={inputRef}
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
});

AddGuestForm.displayName = 'AddGuestForm';

AddGuestForm.propTypes = {
  value: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  inputRef: PropTypes.object
};

export default AddGuestForm;
