import React from 'react';
import PostField from './PostField';
import PostMap from './PostMap';

import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import './FormStyles.css'

function PostForm({post}) {
  const handleInputChange = (event) => {
    let fieldId = event.target.attributes.name.value;
    let value = event.target.value;
    setValue(fieldId, value);
    event.preventDefault();
  }

  const handleOptionsChange = (event) => {
    let fieldId = event.target.attributes.name.value;
    let value = event.target.attributes.value.value;
    if (event.target.attributes.type.value === 'checkbox') {

      // if we have a checkbox, we need to check if the value is there already or not.
      // 1. find the field
      post.post_content.forEach(task => {
        task.fields.forEach(field => {
          if (field.id === parseInt(fieldId)) {
            // 2. Check if we need to create the field-value, or add or remove the value 
            if (!field.value.value || field.value.value.length < 1) {
              field.value.value = [value];
            } else if (field.value.value.indexOf(value) === -1) {
              field.value.value.push(value);
            } else {
              field.value.value.splice(field.value.value.indexOf(value), 1);
            }
          }
        });
      });
    } else {
      // for radio-buttons we just need to worry about one value at the time
      setValue(fieldId, value);
    }
  }

  const handleSelectChange = (event) => {
    let selected = event.target.options.selectedIndex;
    let value = event.target.options[selected].value;
    let fieldId = event.target.attributes.name.value;
    setValue(fieldId, value);
    event.preventDefault();
  }

  const setValue = (fieldId, value) => {
    post.post_content.forEach(task => {
      task.fields.forEach(field => {
        if (field.id === parseInt(fieldId)) {
          if (field.type === 'title' || field.type === 'description') {
            post[field.type] = value;
          } else {
            field.value = {value}
          }
        }
      });
    });
  }

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
            onChange = setValue;
          } else if (field.type === 'point' && field.input === 'location') {
            onChange = setValue;
            return <PostMap key={j} field={field} onChange={onChange.bind(this)} />
          }
          return <PostField key={j} field={field} onChange={onChange.bind(this)} />
        });
      });
    }
  }

  //the structure depends on what form-fields the survey consists of
  return getStructure();
}

export default PostForm;
