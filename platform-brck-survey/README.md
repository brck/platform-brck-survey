 This repo is a dymnamic React form that just:
 reads form configurations from platform-api, 
 generates a form in HTML,
 then allows submission of data to platform-api

URL to render a form in the Moja experience is as follows;

`https://www.mojawifi.com/moja-survey/?survey={surveyId}&host={hostname}&uId={userId}`

`hostname` refers to the ushahidi.io server hosting the forms to render. When not specified, it defaults to `brck-tests`. This variable is NOT mandatory.

`surveyId` refers to the form id in the host above.  When not specified, it defaults to `0`. This variable is MANDATORY.

`userId` referes to the Moja experience user id. Its use here is to attach a user to a survey fielded. This variable is NOT mandatory.
