import React from 'react';

/**
 * Checkbox input component
 * @param {*} props
 */

const CheckboxInputComponent = (props) => {

  let elements = []
  for (var i=0; i<props.attribute.options.length; i++) {
    let checked = false
    if (props.attribute.options[i] === props.attribute.default) {
      checked = true
    }

    let _elements = <span key={i}>
      {props.attribute.options[i]}
      <input
        id={props.attribute.key}
        name={props.attribute.key}
        type={props.attribute.input}
        value={props.attribute.options[i]}
        checked={checked}
        required="required"
        onChange={(value) => {
          console.log(value);
        }}  />
    </span>

    elements[i] =  _elements
  }

  return (
    <div>
      <p>
          <label htmlFor="content">{props.attribute.label}</label>
      </p>
      {elements}
    </div>
  );
}

export default CheckboxInputComponent;
