import * as UshSdk from 'ushahidi-platform-sdk';

const apiPrefix = process.env.API_SCHEME || 'http://';
const baseUrl = process.env.REACT_APP_API_BASEURL || 'api.ushahidi.io';

let formId = 0
let host = ""
let surveys;
let posts;
  

export const setFormId = (fId) => {
  if (fId > 0) {
    formId = fId;
  }
}

export const initiateSdk = () => {
  surveys =  new UshSdk.Surveys(host);
  posts = new UshSdk.Posts(host);
}
export const setHost = (serverHost) => {
  host = apiPrefix + serverHost + '.' + baseUrl;
}

export const getFormInfo = () => {
  return surveys.getSurveys(formId);
} 

export const savePost = (post) => {
  return posts.savePost(post);
}



