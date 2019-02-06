import React, { Component } from 'react';
import PostForm from './PostForm';
import * as api from './helpers/fetchData';
import './App.css';

const formId = 2

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      config: [],
      formInfo: {},
      attributes: {}
    };
  }

  /**
   * Init code
   */
  componentDidMount() {
    //read
    api.setFormId(formId)
    api.getConfig().then(configData => this.setState({ config: configData }));
    api.getFormInfo(formId).then(formInfo => this.setState({ formInfo: formInfo }));
    api.getFeatures().then(features => this.setState({ features }));
    api.getStages(formId).then(stages => this.setState({ stages }));
    api.getAttributes(formId).then(attributes => this.setState({ attributes }));
    api.getTags().then(tags => this.setState({ tags }));
    api.getToken().then(headerToken => this.setState({ headerToken }))
  }

  /**
   * Central rendition engine
   */
  render() {
    return (<div className="App">
      <PostForm stages={this.state.stages} attributes={this.state.attributes} />
    </div>)
  }
}

export default App;
