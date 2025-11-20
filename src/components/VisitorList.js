import React from 'react';
import PropTypes from 'prop-types';

const VisitorList = (props) => (
    <ul>
        {props.visitors.map((visitor, index) => (
            <li key={index} className="in"><span>{visitor.name}</span>
                <label>Time In: {visitor.timeIn}</label>
                <label>Classroom: {visitor.classroom}</label>
                <label>Visit Type: {visitor.visitType}</label>
                <button>Check Out</button>
            </li>
        ))}
    </ul>
);

VisitorList.propTypes = {
    visitors: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        timeIn: PropTypes.string.isRequired,
        classroom: PropTypes.string.isRequired,
        visitType: PropTypes.string.isRequired
    })).isRequired
};

export default VisitorList;