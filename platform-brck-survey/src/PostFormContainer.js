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
  loading: true,
  isNotValid: false
};

const redirectUrls = process.env.REACT_APP_REDIRECT_URLS ?  process.env.REACT_APP_REDIRECT_URLS.split(",") : [];
const redirectForms = process.env.REACT_APP_FORM_IDS_REDIRECT ? process.env.REACT_APP_FORM_IDS_REDIRECT.split(",") : [];
  
const reducer = (state, action) => {
  switch(action.type) {
    case 'FETCH_SUCCESS':
      const newPost = state.post;
      newPost.post_content = action.payload.tasks;
      newPost.form_id = action.payload.id;
      return {
        ...state,
        form: action.payload,
        post: newPost,
        error: '',
        language: action.payload.enabled_languages.default,
        loading: false,
        submitting: false
      };

    case 'FETCH_ERROR':
      return {
        ...state,
        error: 'Something went wrong!',
        loading: false
      };

    case 'SET_LANGUAGE':
      let post = {...state.post, base_language: action.payload}
      return {
        ...state,
        post,
        language: action.payload
      }

      case 'UPDATE_POST':
        return {
          ...state,
          post: action.payload
        }

        case 'VALIDATION_ERROR':
          return {
            ...state,
            isNotValid: action.payload
          }
        case 'SUBMITTING':
          return {
            ...state,
            submitting: action.payload
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
    dispatch({type: 'VALIDATION_ERROR', payload:false});
    let newPost = matchPostValues(value);
    if(!state.errors) {
      if(!state.submitting) {
        dispatch({type: 'SUBMITTING', payload:true});
        api.savePost(newPost).then(response => {
          dispatch({type: 'UPDATE_POST', payload: response.data.result});
          dispatch({type: 'VALIDATION_ERROR', payload: false});
          dispatch({type: 'SUBMITTING', payload: false})
        }, err => {
          dispatch({type: 'SUBMITTING', payload: false});
        });
      }
    } else {
      dispatch({type: 'VALIDATION_ERROR', payload: true});
      dispatch({type: 'SUBMITTING', payload: false})
    }
  }

  const matchPostValues = (value) => {
    let newPost = {...state.post};
    newPost.post_content = state.post.post_content.map(task => {
      let fields = task.fields.map(field => {
        let canBeBlank = field.type === 'title' || field.type === 'description';
          if(field.required && !value[field.id].value && !canBeBlank) {
              dispatch({type: 'VALIDATION_ERROR', payload: true});
            } else {
          if(value[field.id].value || canBeBlank) {
            if (canBeBlank) {
              const fieldType = field.type === 'title' ? 'title' : 'content';
              newPost[fieldType] = field.default ? field.default : field.label;
            } else if(field.type === 'tags') {
              let fieldValue = value[field.id].value.map(tag=>parseInt(tag));
              return {...field, value: {value: fieldValue}}
            } else {
              let fieldValue = value[field.id].value;
              return {...field, value: {value: fieldValue}}
            }
          }
        }
        return field;
      });
      return {...task, fields};
    });
    return newPost;
  }

  useEffect(() => {
    if(state.isNotValid) {
      const list = document.getElementsByClassName("error");
      list[0].scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.isNotValid]);

  const handleLanguageSelect = e => {
    let selected = e.target.options.selectedIndex;
    let value = e.target.options[selected].value;  
    dispatch({type:'SET_LANGUAGE', payload: value});
  };

  const getThankYouPage = () => {
    if(redirectUrls.length > 0 && redirectForms.includes(state.form.id.toString())) {        
      return (
        <div className="large-12 columns">          
          <strong>Thank you for your submission, please visit one of our Facebook-pages: </strong>
          <br/>
          <a href="https://www.facebook.com/groups/418760305962072" target="_blank" rel="noopener noreferrer">AMAHORO KURI TWESE GROUP</a>
          <br/>
          <a href="https://www.facebook.com/groups/1088656244909985" target="_blank" rel="noopener noreferrer">GIRA AMAHORO GROUP</a>
        </div>
        );
    } else {
      return <strong> Thank you for your submission!</strong>
    }
  }

  // Rendering
  if(state.form && state.form.tasks) {
    // Rendering form
    if(state.post && state.post.id === 0) {
      const languageOptions = [state.form.enabled_languages.default, ...state.form.enabled_languages.available];
      return (
          <div>
            <h1>{state.form.name}</h1>
              <div className="large-12 columns">          
                    {languageOptions.length > 1 ? 
                      <LanguageSwitch
                        onChange={e => handleLanguageSelect(e)}
                        languages={languageOptions}
                      />
                      :''}
                      <PostForm
                        post={state.post}
                        isNotValid={state.isNotValid}
                        language={state.language}
                        handleSubmit={handleSubmit}
                        submitting={state.submitting}
                      />
                </div>
          </div>
          );
      } else {
      // Rendering thank-you note
      return getThankYouPage();
      } 
  } else {
  // We are fetching the form
    return <div>{state.loading ? <h1>Loading</h1>:''}</div>;
  }
}

export default PostFormContainer;
