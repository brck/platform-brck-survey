import React from 'react';

/**
 * Radio input component
 * @param {*} props 
 */
const RadioInputComponent = (props) => {
    return (
        <div>
            <p>
                <label htmlFor="content">{props.attribute.label}</label>
            </p>
            {/* Put control here */}
        </div>
    );
}

export default RadioInputComponent;