import React from 'react';

/**
 * Select input component
 * @param {*} props 
 */
const SelectInputComponent = (props) => {
    return (
        <div>
            <p>
                <label htmlFor="content">{props.attribute.label}</label>
            </p>
            {/* Put control here */}
        </div>
    );
}

export default SelectInputComponent;