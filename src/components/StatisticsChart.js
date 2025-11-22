import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FiUsers, FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi';
import './StatisticsChart.css';

/**
 * StatisticsChart component displays visual statistics and charts
 * @param {Object} props
 * @param {number} props.attending - Number of confirmed guests
 * @param {number} props.unconfirmed - Number of pending guests
 * @param {number} props.total - Total number of guests
 */
const StatisticsChart = React.memo(({ attending, unconfirmed, total }) => {
  const confirmationRate = useMemo(() => {
    if (total === 0) return 0;
    return Math.round((attending / total) * 100);
  }, [attending, total]);

  const stats = useMemo(() => [
    {
      label: 'Total Guests',
      value: total,
      icon: FiUsers,
      color: '#58b7cd',
      bgColor: 'rgba(88, 183, 205, 0.15)'
    },
    {
      label: 'Confirmed',
      value: attending,
      icon: FiCheckCircle,
      color: '#4caf50',
      bgColor: 'rgba(76, 175, 80, 0.15)'
    },
    {
      label: 'Pending',
      value: unconfirmed,
      icon: FiClock,
      color: '#ff9800',
      bgColor: 'rgba(255, 152, 0, 0.15)'
    },
    {
      label: 'Confirmation Rate',
      value: `${confirmationRate}%`,
      icon: FiTrendingUp,
      color: '#9c27b0',
      bgColor: 'rgba(156, 39, 176, 0.15)'
    }
  ], [total, attending, unconfirmed, confirmationRate]);

  return (
    <div className="statistics-chart-container">
      <h3 className="statistics-chart-title">Guest Statistics</h3>

      {/* Stats Cards */}
      <div className="stats-cards">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{ backgroundColor: stat.bgColor }}
          >
            <stat.icon className="stat-icon" style={{ color: stat.color }} />
            <div className="stat-content">
              <span className="stat-value" style={{ color: stat.color }}>
                {stat.value}
              </span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Bar Chart */}
      <div className="chart-section">
        <h4>Confirmation Progress</h4>
        <div className="progress-chart">
          <div className="progress-bar-container">
            <motion.div
              className="progress-bar confirmed"
              initial={{ width: 0 }}
              animate={{ width: `${confirmationRate}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            <motion.div
              className="progress-bar pending"
              initial={{ width: 0 }}
              animate={{ width: `${100 - confirmationRate}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            />
          </div>
          <div className="progress-legend">
            <div className="legend-item">
              <span className="legend-color confirmed" />
              <span>Confirmed ({attending})</span>
            </div>
            <div className="legend-item">
              <span className="legend-color pending" />
              <span>Pending ({unconfirmed})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Donut Chart */}
      {total > 0 && (
        <div className="chart-section">
          <h4>Distribution</h4>
          <div className="donut-chart-wrapper">
            <svg className="donut-chart" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="var(--border-color, #e0e0e0)"
                strokeWidth="12"
              />
              {/* Confirmed segment */}
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#4caf50"
                strokeWidth="12"
                strokeDasharray={`${confirmationRate * 2.51} ${251 - confirmationRate * 2.51}`}
                strokeDashoffset="62.75"
                initial={{ strokeDasharray: '0 251' }}
                animate={{ strokeDasharray: `${confirmationRate * 2.51} ${251 - confirmationRate * 2.51}` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
              {/* Center text */}
              <text
                x="50"
                y="47"
                textAnchor="middle"
                className="donut-center-value"
              >
                {confirmationRate}%
              </text>
              <text
                x="50"
                y="58"
                textAnchor="middle"
                className="donut-center-label"
              >
                confirmed
              </text>
            </svg>
          </div>
        </div>
      )}

      {/* Empty State */}
      {total === 0 && (
        <div className="chart-empty-state">
          <FiUsers size={48} />
          <p>Add some guests to see statistics</p>
        </div>
      )}
    </div>
  );
});

StatisticsChart.displayName = 'StatisticsChart';

StatisticsChart.propTypes = {
  attending: PropTypes.number.isRequired,
  unconfirmed: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired
};

export default StatisticsChart;
