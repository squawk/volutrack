import React from 'react';

const VistorList = (props) => (
    <ul>
        {props.visitors.map(visitor => (
            <li className="in"><span>{visitor.name}</span>
                <label>Time In: {visitor.timeIn}</label>
                <label>Classroom: {visitor.classroom}</label>
                <label>Visit Type: {visitor.visitType}</label>
                <button>Check Out</button>
            </li>
        ))}
    </ul>
);

export default VistorList;