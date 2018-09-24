import React from 'react';

const DescriptionInput = (props) => {
    return (
        <div> 
        <p>
        <label htmlFor="content">{props.attribute.label}</label>
        </p>
        <textarea className='descriptionInput' id="content" name="content" data-min-rows="1" rows="1"  required="required" >
        </textarea>
        </div>
    );
}

export default DescriptionInput;