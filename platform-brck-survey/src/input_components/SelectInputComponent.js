import React from 'react';

/**
 * Select input component
 * @param {*} props
 */


const SelectInputComponent = (props) => {
  let options = []
  for (var i=0; i<props.attribute.options.length; i++) {
    let _options = <option key={i} value={props.attribute.options[i]}>{props.attribute.options[i]}</option>
    options[i] = _options
  }

  return (
    <div>
      <p>
          <label htmlFor="content">{props.attribute.label}</label>
      </p>
      <select id={props.attribute.key} value={props.attribute.default} onChange={() => this.handleChange}>
        {options}
      </select>
    </div>
  );
}

export default SelectInputComponent;
