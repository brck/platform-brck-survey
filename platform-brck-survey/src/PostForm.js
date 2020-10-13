import React, {useState, useCallback} from 'react';
import PostField from './PostField';
import PostMap from './PostMap';

import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import './FormStyles.css'

function PostForm({post, language, handleSubmit}) {
  const [value, setValue] = useState({});

  const handleInputChange = useCallback((event) => {
    let fieldId = event.target.attributes.name.value;
    let value = event.target.value;
    setFieldValue(fieldId, value);
    event.preventDefault();
  }, [value]);

  const handleOptionsChange = (event) => {
    event.preventDefault();

    let fieldId = event.target.attributes.name.value;
    let fieldValue = event.target.attributes.value.value;
    if (event.target.attributes.type.value === 'checkbox') {

      // if we have a checkbox, we need to check if the value is there already or not.
      // 1. find the field
        let selectedValues = value[fieldId];
      // 2. Check if we need to create the field-value, or add or remove the value 
            if (!selectedValues || selectedValues.length < 1) {
              selectedValues = [fieldValue];
            } else if (!selectedValues.includes(fieldValue)) {
              selectedValues.push(fieldValue);
            } else {
              selectedValues.splice(selectedValues.indexOf(fieldValue), 1);
            }
            
            setFieldValue(fieldId, selectedValues);
        } else {
      // for radio-buttons we just need to worry about one value at the time
      setFieldValue(fieldId, value);
    }
  }

  const handleSelectChange = (event) => {
    let selected = event.target.options.selectedIndex;
    let value = event.target.options[selected].value;
    let fieldId = event.target.attributes.name.value;
    setFieldValue(fieldId, value);
    event.preventDefault();
  }
  // Using useCallback to prevent re-rendering of the map each time state changes
  const setMapValue = useCallback((fieldId, fieldValue) => {
    setFieldValue(fieldId, fieldValue);
  },[]);

  const setFieldValue = (fieldId, fieldValue) => {
    let newFieldValue = {};
    newFieldValue[fieldId] = fieldValue;
    setValue({...value, ...newFieldValue});
  };

  const getStructure = () => {
    if (post && post.post_content) {
      return post.post_content.map((task, i) => {
        return task.fields.map((field, j) => {
          let onChange = handleInputChange;
          field.value = {};
          if (field.input === 'tags' || field.input === 'checkbox' || field.input === 'radio') {
            onChange = handleOptionsChange;
          } else if (field.input === 'select') {
            onChange = handleSelectChange;
          } else if (field.type === 'datetime') {
            onChange = setFieldValue;
          } else if (field.type === 'point' && field.input === 'location') {
            onChange = setMapValue;
            return <PostMap key='map' field={field} onChange={onChange} language={language} />
          }
          return <PostField key={j} field={field} onChange={onChange} language={language} />
        });
      });
    }
  }

  //the structure depends on what form-fields the survey consists of
  return (
    <form 
      name="postForm"
      onSubmit={e => handleSubmit(e,value)}
      noValidate=""
    >
      {getStructure()}
      <button
        className="button expanded">
          Submit
      </button>
    </form>
  );
}

export default PostForm;
