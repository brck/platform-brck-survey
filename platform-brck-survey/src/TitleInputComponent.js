import React from 'react';

const TitleInputComponent = (props) => {
    return (
        <div>
        <p><label htmlFor="title">{props.attribute.label}</label></p>
        <input id="title" name="title" type="text"  min="2" max="150" required="required"></input>
        </div>
    );
}

export default TitleInputComponent;