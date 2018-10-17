import React from 'react';

/**
 * Plain Date input component
 * @param {*} props 
 */
const DateInputComponent = (props) => {
    return (
        <div>
            <p>
                <label htmlFor="content">{props.attribute.label}</label>
            </p>
            {/* Put control here */}
        </div>
    );
}

export default DateInputComponent;