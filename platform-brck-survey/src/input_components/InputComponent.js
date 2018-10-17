import React from 'react';

/**
 * Standard text input component
 * @param {*} props 
 */
const InputComponent = (props) => {
    return (
        <div>
            <p>
                <label htmlFor=''>{props.attribute.label}</label>
            </p>
            <input id={'values[' + props.attribute.key + '][0]'}
                name="values_7"
                type="text"
                required="required" />
        </div>
    );
}

export default InputComponent;