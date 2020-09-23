import React, { useState, useEffect } from 'react';
import * as api from './helpers/fetchData';
import PostForm from './PostForm';
import LanguageSwitch from './LanguageSwitch';

function PostFormContainer(props) {
  const [form, setForm] = useState({});
  const [post, setPost] = useState({ 
    id: 0,
    title: '',
    description: '',
    locale: 'en_US',
    completed_stages: [],
    published_to: [],
    post_date: new Date(),
    enabled_languages: {}
  });
  const [language, setLanguage] = useState('');
  const setConfig = async () => {
    await api.setFormId(props.formId);
    await api.setHost(props.host);
    await api.initiateSdk();
  };

  useEffect(() => {
    setConfig().then(() => {
      api.getFormInfo().then(response => {
        post.form_id = response.id;
        post.post_content = response.tasks;
        setPost(post);
        setForm(response);
        setLanguage(response.enabled_languages.default);
        });
    });
  },[]);

  const handleSubmit = (event) => {
    api.savePost(post).then(response => {
      //TODO show message
    });
    event.preventDefault();
  }

  const handleLanguageSelect = e =>{
    let selected = e.target.options.selectedIndex;
    let value = e.target.options[selected].value;  
    setLanguage(value);
  }

  if(form && form.tasks) {
    const languageOptions = [form.enabled_languages.default, ...form.enabled_languages.available];
    return (
        <div>
          <h1>{form.name}</h1>
            <div className="large-12 columns">
              <form name="postForm" onSubmit={handleSubmit.bind(this)} noValidate="">
                  {languageOptions.length > 1 ? 
                    <LanguageSwitch onChange={e => handleLanguageSelect(e)} languages={languageOptions} />
                    :''}
                  {language}
                  <PostForm post={post} language={language} />
                  <button className="button expanded">Submit</button>
              </form>
            </div>
        </div>
      );
  } else {
      return (
          <h1>loading</h1>
      );
  }
}

export default PostFormContainer;
