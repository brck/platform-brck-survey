import React from 'react';

/**
 * Tags input component
 * @param {*} props 
 */
const TagsInputComponent = (props) => {
    return (
        <div>
            <p>
                <label htmlFor="content">{props.attribute.label}</label>
            </p>
            {/* Put control here */}
        </div>
    );
}

export default TagsInputComponent;