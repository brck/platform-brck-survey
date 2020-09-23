import React, { useState, useEffect } from 'react';
import * as api from './helpers/fetchData';
import PostForm from './PostForm';

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

  const setConfig = async () => {
    await api.setFormId(props.formId);
    await api.setHost(props.host);
    await api.initiateSdk();
  };
  
  const handleSubmit = (event) => {
    api.savePost(post).then(response => {
      //TODO show message
    });
    event.preventDefault();
  }
  
  useEffect(() => {
    setConfig().then(() => {
      api.getFormInfo().then(response => {
        post.form_id = response.id;
        post.post_content = response.tasks;
        setPost(post);
        setForm(response);
        });
    });
  },[]);

  if(form && form.tasks) {
      return (
        <div>
          <h1>{form.name}</h1>
            <div className="large-12 columns">
              <form name="postForm" onSubmit={handleSubmit.bind(this)} noValidate="">
                  <h2>Language-switch</h2>
                  <PostForm post={post} />
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
