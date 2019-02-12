import React, { Component } from 'react';
import PostForm from './PostForm';
import * as api from './helpers/fetchData';
import './App.css';
import queryString from 'query-string';

const values = queryString.parse(document.location.search)
const formId = (values.survey !== undefined && values.survey !== "" ? parseInt(values.survey) : 0)
// console.log(formId)

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      config: [],
      formInfo: {},
      attributes: {},
      surveySought: false
    };
  }

  /**
   * Init code
   */
  componentDidMount() {
    //read
    if (formId > 0) {
      this.readData();
    }
  }

  readData = async () => {
    await api.setFormId(formId)
    await api.getFormInfo(formId)
    .then(formInfo => {
      if (formInfo !== undefined && Object.getOwnPropertyNames(formInfo).length > 0) {
        this.setState({
          formInfo: formInfo
        })
      }
    })
    if (this.state.formInfo !== undefined && Object.getOwnPropertyNames(this.state.formInfo).length > 0) {
      await api.getConfig().then(configData => this.setState({ config: configData }));
      await api.getFeatures().then(features => this.setState({ features }));
      await api.getStages(formId).then(stages => this.setState({ stages }));
      await api.getAttributes(formId).then(attributes => this.setState({ attributes }));
      await api.getTags().then(tags => this.setState({ tags }));
      await api.getToken().then(headerToken => this.setState({ headerToken }))
    }

    await this.setState({ surveySought: true })
  }

  /**
   * Central rendition engine
   */
  render() {
    if (this.state.surveySought) {
      if (this.state.formInfo !== undefined && Object.getOwnPropertyNames(this.state.formInfo).length > 0) {
        return (<div className="App">
          <PostForm stages={this.state.stages} attributes={this.state.attributes} />
        </div>)
      } else {
        return (
          <div className="large-12 columns callout-top-margin">
            <div className="callout success">
              <h3>Error! </h3><hr />
              <p className="callout-message">No survey has been specified or found.</p>
            </div>
          </div>
        )
      }
    } else {
      return (
        <div>Loading</div>
      )
    }
  }
}

export default App;
