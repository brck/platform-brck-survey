import React from 'react';
import queryString from 'query-string';
import PostFormContainer from './PostFormContainer';

function App() {
  const values = queryString.parse(document.location.search);
  const formId = (values.survey !== undefined && values.survey !== "" ? parseInt(values.survey) : 0)
  const userId = (values.uid !== undefined && values.uid !== "" ? values.uid : "anonymous");
  const host = (values.host !== undefined && values.host !== "" ? values.host : "");

  if (formId) {
    return (<PostFormContainer formId={formId} userId={userId} host={host} />);
  } else {
    return (
      <div className="large-12 columns callout-top-margin">
         <div className="callout alert">
           <h3>Error! </h3><hr />
           <p className="callout-message">No survey has been specified or found.</p>
         </div>
       </div>
     );
   }
}
export default App;
