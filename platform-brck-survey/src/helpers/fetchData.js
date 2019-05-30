import * as fetch from 'isomorphic-fetch';

// @TODO: actually read these from the env

const apiPrefix = process.env.API_SCHEME || 'https://';
const baseUrl = process.env.API_BASEURL || 'api.ushahidi.io';
const apiSuffix = process.env.API_PREFIX || '/api/v3';
const uiClientSecret = process.env.OAUTH_CLIENT_SECRET || '35e7f0bca957836d05ca0492211b0ac707671261';

let formId = 0
let host = ""

export const setFormId = (fId) => {
  if (fId > 0) {
    formId = fId;
  }
}

export const setHost = (serverHost) => {
  host = apiPrefix + serverHost + '.' + baseUrl;
}

export const getConfig = () => fetch(`${host}${apiSuffix}/config`)
  .then((response) => {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json();
  })
  .then(data => data)
  .catch((error) => { console.log(`an error happened: ${error}`); });

export const getTags = () => fetch(`${host}${apiSuffix}/tags`)
  .then(response => response.json())
  .then(data => data);

export const getSite = () => fetch(`${host}${apiSuffix}/site`)
  .then((response) => { console.log('the response', response); return response.json(); })
  .then(data => data);

export const getFeatures = () => fetch(`${host}${apiSuffix}/config/features`)
  .then(response => response.json())
  .then(data => data);

export const getFormInfo = () => fetch(`${host}${apiSuffix}/forms/${formId}`)
  .then(response => response.json())
  .then(data => data)
  .catch(error => {console.log(error)});

export const getAttributes = () => fetch(`${host}${apiSuffix}/forms/${formId}/attributes?order=asc&orderby=priority`)
  .then(response => response.json())
  .then(data => data);

export const getStages = () => fetch(`${host}${apiSuffix}/forms/${formId}/stages?order=asc&orderby=priority`)
  .then(response => response.json())
  .then(data => data);

export const getToken = () => {
  const requestPayload = {
    grant_type: 'client_credentials',
    client_id: 'ushahidiui',
    client_secret: uiClientSecret,
    scope: 'posts country_codes media forms api tags savedsearches sets users stats layers config messages notifications webhooks contacts roles permissions csv',
  };

  return fetch(`${host}/oauth/token`, {
    method: 'post',
    body: JSON.stringify(requestPayload),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(response => response.json())
    .then(data => data);
};

export const sendFormData = (formData, theToken) => {
  const authString = `Bearer ${theToken}`;
  return fetch(`${host}${apiSuffix}/posts`, {
    method: 'post',
    headers: {
      Authorization: authString,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    })
    .then(data => data);
};
