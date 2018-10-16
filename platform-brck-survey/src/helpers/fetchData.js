import * as fetch from 'isomorphic-fetch';

// @TODO: actually read these from the env
const baseUrl = process.env.API_BASEURL || 'https://brck-tests.api.ushahidi.io';
const apiPrefix = process.env.API_PREFIX || '/api/v3';
const uiClientSecret = process.env.OAUTH_CLIENT_SECRET || '3a845183-62f4-4d92-b1fc-29d81188b5aa';

export const getConfig = () => fetch(`${baseUrl}${apiPrefix}/config`)
  .then((response) => {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json();
  })
  .then(data => data)
  .catch((error) => { console.log(`an error happened: ${error}`); });

export const getTags = () => fetch(`${baseUrl}${apiPrefix}/tags`)
  .then(response => response.json())
  .then(data => data);

export const getSite = () => fetch(`${baseUrl}${apiPrefix}/site`)
  .then((response) => { console.log('the response', response); return response.json(); })
  .then(data => data);

export const getFeatures = () => fetch(`${baseUrl}${apiPrefix}/config/features`)
  .then(response => response.json())
  .then(data => data);

export const getFormInfo = formId => fetch(`${baseUrl}${apiPrefix}/forms/${formId}`)
  .then(response => response.json())
  .then(data => data);

export const getAttributes = () => fetch(`${baseUrl}${apiPrefix}/forms/2/attributes?order=asc&orderby=priority`)
  .then(response => response.json())
  .then(data => data);

export const getStages = () => fetch(`${baseUrl}${apiPrefix}/forms/2/stages?order=asc&orderby=priority`)
  .then(response => response.json())
  .then(data => data);

export const getToken = () => {
  const requestPayload = {
    grant_type: 'client_credentials',
    client_id: 'ushahidiui',
    client_secret: uiClientSecret,
    scope: 'posts country_codes media forms api tags savedsearches sets users stats layers config messages notifications webhooks contacts roles permissions csv',
  };

  return fetch(`${baseUrl}/oauth/token`, {
    method: 'post',
    body: JSON.stringify(requestPayload),
    headers: {
      // Authorization: `Bearer ${}`,
      'Content-Type': 'application/json',
    },
  }).then(response => response.json())
    .then(data => data);
};

export const sendFormData = (formData, theToken) => {
  const authString = `Bearer ${theToken}`;
  const fetchConfig = {
    headers: {
      Authorization: authString,
      'Content-Type': 'application/json',
    },
    method: 'post',
    body: JSON.stringify(formData),
  };

  return fetch(`${baseUrl}${apiPrefix}/posts`, fetchConfig)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    })
    .then(data => data);
};
