import React from 'react';
import PropTypes from 'prop-types';
import AddGuestForm from './AddGuestForm';

/**
 * Header component containing title and add guest form
 * @param {Object} props - Component props
 * @param {string} props.title - Application title
 * @param {string} props.subtitle - Application subtitle
 * @param {string} props.formValue - Current form input value
 * @param {Function} props.onFormSubmit - Form submit handler
 * @param {Function} props.onFormChange - Form input change handler
 * @param {string} props.formError - Form validation error
 * @param {React.RefObject} props.inputRef - Ref for the input element
 */
const Header = ({
  title,
  subtitle = '',
  formValue,
  onFormSubmit,
  onFormChange,
  formError = '',
  inputRef
}) => {
  return (
    <header>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <AddGuestForm
        value={formValue}
        onSubmit={onFormSubmit}
        onChange={onFormChange}
        error={formError}
        inputRef={inputRef}
      />
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  formValue: PropTypes.string.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  onFormChange: PropTypes.func.isRequired,
  formError: PropTypes.string,
  inputRef: PropTypes.object
};

export default Header;
