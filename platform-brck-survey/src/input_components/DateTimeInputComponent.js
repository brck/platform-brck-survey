import React from 'react';

/**
 * Date & Time input component
 * @param {*} props 
 */
const DateTimeInputComponent = (props) => {
    return (
        <div>
            <p>
                <label htmlFor="content">{props.attribute.label}</label>
            </p>
            {/* Put control here */}
        </div>
    );
}

export default DateTimeInputComponent;