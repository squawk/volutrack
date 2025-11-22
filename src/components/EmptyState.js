import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FiUserPlus, FiUsers, FiSearch } from 'react-icons/fi';
import './EmptyState.css';

/**
 * EmptyState component with illustration and call-to-action
 * @param {Object} props
 * @param {string} props.type - Type of empty state: 'no-guests', 'no-results', 'filtered'
 * @param {string} props.searchQuery - Current search query
 * @param {Function} props.onClearSearch - Handler for clearing search
 * @param {Function} props.onFocusInput - Handler for focusing the add guest input
 */
const EmptyState = ({ type = 'no-guests', searchQuery = '', onClearSearch, onFocusInput }) => {
  const content = {
    'no-guests': {
      icon: FiUsers,
      title: 'No guests yet',
      description: 'Start building your guest list by adding your first volunteer or visitor.',
      action: 'Add Your First Guest',
      actionHandler: onFocusInput
    },
    'no-results': {
      icon: FiSearch,
      title: 'No matching guests',
      description: `No guests match "${searchQuery}". Try a different search term.`,
      action: 'Clear Search',
      actionHandler: onClearSearch
    },
    'filtered': {
      icon: FiUsers,
      title: 'No confirmed guests',
      description: 'None of your guests have been confirmed yet. Mark guests as confirmed to see them here.',
      action: 'Show All Guests',
      actionHandler: onClearSearch
    }
  };

  const { icon: Icon, title, description, action, actionHandler } = content[type] || content['no-guests'];

  return (
    <motion.div
      className="empty-state"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Illustration */}
      <div className="empty-state-illustration">
        <motion.div
          className="illustration-circle outer"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className="illustration-circle middle"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.3
          }}
        />
        <motion.div
          className="illustration-icon-container"
          animate={{
            y: [0, -8, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <Icon className="illustration-icon" />
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="decoration dot-1"
          animate={{
            y: [0, -10, 0],
            x: [0, 5, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className="decoration dot-2"
          animate={{
            y: [0, 8, 0],
            x: [0, -5, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5
          }}
        />
        <motion.div
          className="decoration dot-3"
          animate={{
            y: [0, -6, 0],
            x: [0, -8, 0],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
        />
      </div>

      {/* Content */}
      <motion.h3
        className="empty-state-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {title}
      </motion.h3>

      <motion.p
        className="empty-state-description"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {description}
      </motion.p>

      {/* CTA Button */}
      <motion.button
        className="empty-state-cta"
        onClick={actionHandler}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiUserPlus />
        {action}
      </motion.button>

      {/* Tips */}
      {type === 'no-guests' && (
        <motion.div
          className="empty-state-tips"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="tips-title">Quick tips:</p>
          <ul>
            <li>Press <kbd>Ctrl</kbd> + <kbd>N</kbd> to quickly add a new guest</li>
            <li>Search guests with <kbd>Ctrl</kbd> + <kbd>F</kbd></li>
            <li>Export your list with <kbd>Ctrl</kbd> + <kbd>E</kbd></li>
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
};

EmptyState.propTypes = {
  type: PropTypes.oneOf(['no-guests', 'no-results', 'filtered']),
  searchQuery: PropTypes.string,
  onClearSearch: PropTypes.func,
  onFocusInput: PropTypes.func
};

export default EmptyState;
