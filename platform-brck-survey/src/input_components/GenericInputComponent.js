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
            <input id={'values[' + props.attribute.key + '][0]'}
                name="values_7"
                type="text"
                required="required" />
        </div>
    );
}

export default GenericInputComponent;
