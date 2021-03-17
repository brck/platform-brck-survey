import React, {useState, useCallback} from 'react';
import PostField from './PostField';
import PostMap from './PostMap';
import sortby from 'lodash.sortby';

import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import './FormStyles.css'

function PostForm({post, language, handleSubmit, isNotValid, submitting}) {
  const generateInitialState = () => {
    const initialPostState = {};
    post.post_content.forEach(tasks => {
      tasks.fields.forEach(field => {
        initialPostState[field.id] = {
          required: field.required
        }
      });
    });
    return initialPostState;
  }
  const [value, setValue] = useState(generateInitialState());
  const handleInputChange = (event) => {
    let fieldId = event.target.attributes.name.value;
    let value = event.target.value;
    setFieldValue(fieldId, value);
  };

  const handleOptionsChange = (event) => {
    let fieldId = event.target.attributes.name.value;
    let fieldValue = event.target.attributes.value.value;

    if (event.target.attributes.type.value === 'checkbox') {
      // if we have a checkbox, we need to check if the value is there already or not.
      // 1. find the field
        let selectedValues = value[fieldId] && value[fieldId].value ? value[fieldId].value : null;
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
      setFieldValue(fieldId, fieldValue);
    }
  }

  const handleSelectChange = (event) => {
    let selected = event.target.options.selectedIndex;
    let value = event.target.options[selected].value;
    let fieldId = event.target.attributes.name.value;
    setFieldValue(fieldId, value);
  }

  // Using useCallback to prevent re-rendering of the map each time state changes
  const setMapValue = useCallback((fieldId, fieldValue) => {
    setFieldValue(fieldId, fieldValue);
  },[]);

  const setFieldValue = (fieldId, fieldValue) => {
    let newFieldValue = {};
    newFieldValue[fieldId] = {...value[fieldId], value: fieldValue};
    setValue({...value, ...newFieldValue});
  };

  const getStructure = () => {
    if (post && post.post_content) {
      return post.post_content.map((task, i) => {
        // sorting the fields by priority  
        task.fields = sortby(task.fields, function(field) {
            return field.priority;
          });
        return task.fields.map((field, j) => {
          let onChange = handleInputChange;
          let validField = isNotValid && field.required && !value[field.id].value;
          field.value = {};
          if (field.input === 'tags' || field.input === 'checkbox' || field.input === 'radio') {
            onChange = handleOptionsChange;
          } else if (field.input === 'select') {
            onChange = handleSelectChange;
          } else if (field.type === 'datetime') {
            onChange = setFieldValue;
          } else if (field.type === 'point' && field.input === 'location') {
            onChange = setMapValue;
            return <PostMap key='map' isNotValid={validField} field={field} onChange={onChange} language={language} />
          }
          return <PostField key={j} field={field} isNotValid={validField} onChange={onChange} language={language} />
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
      <div className="medium-12 columns">
        <button disabled={submitting} className="button expanded">
          Submit
        </button>
      </div>
    </form>
  );
}

export default PostForm;
