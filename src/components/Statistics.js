import React from 'react';
import PropTypes from 'prop-types';

/**
 * Statistics component displaying guest count metrics
 * Memoized to prevent unnecessary re-renders when counts don't change
 * @param {Object} props - Component props
 * @param {number} props.attending - Number of confirmed guests
 * @param {number} props.unconfirmed - Number of unconfirmed guests
 * @param {number} props.total - Total number of guests
 */
const Statistics = React.memo(({ attending, unconfirmed, total }) => {
  return (
    <table className="counter" role="table" aria-label="Guest statistics">
      <tbody>
        <tr>
          <td>Attending:</td>
          <td>{attending}</td>
        </tr>
        <tr>
          <td>Unconfirmed:</td>
          <td>{unconfirmed}</td>
        </tr>
        <tr>
          <td>Total:</td>
          <td>{total}</td>
        </tr>
      </tbody>
    </table>
  );
});

Statistics.displayName = 'Statistics';

Statistics.propTypes = {
  attending: PropTypes.number.isRequired,
  unconfirmed: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired
};

export default Statistics;
