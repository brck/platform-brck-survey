import React, {useEffect, useReducer } from 'react';
import * as api from './helpers/fetchData';
import PostForm from './PostForm';
import LanguageSwitch from './LanguageSwitch';

const initialState = {
  form: {},
  post: { 
    id: 0,
    title: '',
    description: '',
    locale: 'en_US',
    completed_stages: [],
    published_to: [],
    post_date: new Date(),
    enabled_languages: {}
  },
  language: '',
  error: '',
  loading: true
};

const reducer = (state, action) => {
  switch(action.type) {
    case 'FETCH_SUCCESS':
      const newPost = state.post;
      newPost.post_content = action.payload.tasks;
      newPost.form_id = action.payload.id;
      return {
        form: action.payload,
        post: newPost,
        error: '',
        language: action.payload.enabled_languages.default,
        loading: false
      };
    case 'FETCH_ERROR':
      return {
        ...initialState,
        error: 'Something went wrong!',
        loading: false
      };
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload
      }
      case 'UPDATE_POST':
        return {
          ...initialState,
          post: action.payload
        }
    default:
      return state;
  }
}

function PostFormContainer(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const setConfig = async () => {
    await api.setFormId(props.formId);
    await api.setHost(props.host);
    await api.initiateSdk();
  };

  useEffect(() => {
    setConfig().then(() => {
      api.getFormInfo().then(response => {
        dispatch({type:'FETCH_SUCCESS', payload:response});
        })
        .catch(dispatch('FETCH_ERROR'))
        .catch(dispatch('FETCH_ERROR'));
    })
  },[]);

  const handleSubmit = (e, value) => {
    e.preventDefault();
    let newPost = state.post;
    newPost.post_content.forEach(task => {
      task.fields.forEach(field => {
        if(value[field.id]) {
          if (field.type === 'title' || field.type === 'description') {
            const fieldType = field.type === 'title' ? 'title' : 'content';
            newPost[fieldType] = value[field.id];
          } else if(field.type === 'tag') {
            field.value.value = value[field.id].map(tag=>parseInt(tag));
          } else {
            field.value.value = value[field.id];
          }
        }
      })})
      api.savePost(state.post).then(response => {
        dispatch({type: 'UPDATE_POST', payload: response.data.result});
      });
  }

  const handleLanguageSelect = e =>{
    let selected = e.target.options.selectedIndex;
    let value = e.target.options[selected].value;  
    dispatch({type:'SET_LANGUAGE', payload: value});
  }

  if(state.form && state.form.tasks) {
    const languageOptions = [state.form.enabled_languages.default, ...state.form.enabled_languages.available];
    return (
        <div>
          <h1>{state.form.name}</h1>
            <div className="large-12 columns">
              
                  {languageOptions.length > 1 ? 
                    <LanguageSwitch onChange={e => handleLanguageSelect(e)} languages={languageOptions} />
                    :''}
                  <PostForm post={state.post} language={state.language} handleSubmit={handleSubmit}/>

              </div>
        </div>)
  } else if(state.post && state.post.id > 0) {
    return <h1> Thank you for your submission!</h1>
  } else {
      return (<div>
          {state.loading ? <h1>Loading</h1>:''}
          <h1>{state.error}</h1>
      </div>);
  }
}

export default PostFormContainer;
