import React from 'react';
import PropTypes from 'prop-types';

/**
 * Avatar component displaying guest initials in a colored circle
 * @param {Object} props
 * @param {string} props.name - Guest name
 * @param {number} props.size - Avatar size in pixels
 */
const Avatar = React.memo(({ name, size = 40 }) => {
  // Get initials from name
  const getInitials = (name) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Generate consistent color based on name
  const getColor = (name) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DFE6E9', '#6C5CE7', '#FD79A8', '#FDCB6E', '#E17055',
      '#74B9FF', '#A29BFE', '#FD79A8', '#FDCB6E', '#55EFC4'
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  const initials = getInitials(name);
  const bgColor = getColor(name);

  const styles = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    backgroundColor: bgColor,
    color: 'white',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: `${size / 2.5}px`,
    marginRight: '10px',
    flexShrink: 0,
    userSelect: 'none'
  };

  return (
    <div style={styles} aria-label={`${name} avatar`}>
      {initials}
    </div>
  );
});

Avatar.displayName = 'Avatar';

Avatar.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number
};

export default Avatar;
