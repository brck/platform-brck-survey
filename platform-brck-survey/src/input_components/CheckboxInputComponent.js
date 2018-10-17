import React from 'react';

/**
 * Checkbox input component
 * @param {*} props 
 */
const CheckboxInputComponent = (props) => {
    return (
        <div>
            <p>
                <label htmlFor="content">{props.attribute.label}</label>
            </p>
            {/* Put control here */}
        </div>
    );
}

export default CheckboxInputComponent;