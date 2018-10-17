import React from 'react';

/**
 * Genric type input component
 * @param {*} props 
 */
const GenericInputComponent = (props) => {
    return (
        <div>
            <p>
                <label htmlFor="content">{props.attribute.label}</label>
            </p>
            {/* Put control here */}
        </div>
    );
}

export default GenericInputComponent;