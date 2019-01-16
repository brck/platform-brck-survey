import React, { Component } from 'react';
import PostForm from './PostForm';
import * as api from './helpers/fetchData';
import './App.css';

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
    api.getConfig().then(configData => this.setState({ config: configData }));
    api.getFormInfo(2).then(formInfo => this.setState({ formInfo: formInfo }));
    api.getFeatures().then(features => this.setState({ features }));
    api.getStages().then(stages => this.setState({ stages }));
    api.getAttributes().then(attributes => this.setState({ attributes }));
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
