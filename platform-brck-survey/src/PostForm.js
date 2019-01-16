// React native imports
import React, { Component } from 'react';

// Code imports
import * as api from './helpers/fetchData';

import './App.css';
import './FormStyles.css'

class PostForm extends Component {
    constructor() {
        super();
        this.state = {
            formState: {
            },
        }
    }

    componentDidMount() {
      this.prepStates()
    }

    setDynamicStateKey = async (key, val) => {
      await this.setState({[key]:val});
    }

    prepStates = async () => {
      await api.getAttributes().then(attributes => this.setState({ attributes }));

      let attributes = this.state.attributes.results
      if (attributes) {
        // eslint-disable-next-line
        attributes.map((attribute) => {
          if (attribute.input === 'checkbox' || attribute.input === 'radio') {
            // eslint-disable-next-line
            attribute.options.map((option) => {
              let checked = false
              if (attribute.default === option) {
                checked = true
              }
              if (attribute.input === 'select') {
                this.setDynamicStateKey(attribute.key + "_" + option.replace(/ /gi,"_"), "selected");
              } else {
                this.setDynamicStateKey(attribute.key + "_" + option.replace(/ /gi,"_"), checked);
              }
            })
          }
          if (attribute.default !== null) {
            this.setDynamicStateKey(attribute.key, attribute.default);
          } else {
            this.setDynamicStateKey(attribute.key, "")
          }
        });
      }
    }

    handleCheckBoxChange = (event) => {
      let _checkBox = event.target;
      let _key = _checkBox.attributes.name.value
      let _ref = _checkBox.attributes.value.value.replace(/ /gi,"_")

      if (_checkBox.checked) {
        this.setState({[_key + "_" + _ref]: true})
      } else {
        this.setState({[_key + "_" + _ref]: false})
      }
    }

    handleRadioChange = (event) => {
      console.log("Radio changed " + Date())
      let _radio = event.target;
      let _key = _radio.attributes.name.value
      let _ref = _radio.attributes.value.value.replace(/ /gi,"_")

      if (_radio.checked) {
        this.setState({[_key + "_" + _ref]: true})
      } else {
        this.setState({[_key + "_" + _ref]: false})
      }
    }

    handleSelectChange = (event) => {
      let _select = event.target;
      let _key = _select.attributes.name.value;
      this.setState({[_key]: _select.options[_select.options.selectedIndex].value})
    }

    handleInputChange = (event) => {
      let _element = event.target;
      let _key = _element.attributes.name.value
      this.setState({[_key]: _element.value})
    }

    /**
     * Form submit handling
     */
    handleSubmit = (event) => {
      event.preventDefault();

      let payloadData = []

      const formElements = this.props.attributes.results
      if (formElements !== undefined) {
        for (var i=0; i<formElements.length; i++) {
          payloadData[formElements[i].key] = this.state[formElements[i].key]
        }
      }

      console.log(payloadData)
    }

    /**
     * Form rendition engine
     */

    render() {
      if (this.state.submitted) {
        return (<div>Submitted!</div>)
      }

      let stageSet = 'Loading...';

      if (this.props.stages) {
        stageSet = this.props.stages.results.map(function (aStage, i) {
          return <div key={i} className="medium-12 columns">
            <h2>{aStage.label}</h2>
            <hr/>
            <h4>{aStage.description}</h4>
          </div>;
        })
      }

      let attributeSet = '';
      if (this.props.attributes.results) {
        // eslint-disable-next-line
        attributeSet = this.props.attributes.results.map((attribute, j) => {
          if (this.state[attribute.key] !== undefined) {
            //lots of conditional stuff here...
            //@TODO: refactor this into its own module
            if (attribute.type === 'title' && attribute.input === 'text') {
              let _required = '';
              if (attribute.required) {
                _required = "required";
              }
              // Render title
              return (
                <div key={j} className="medium-12 columns">
                  <label htmlFor={attribute.key}>{attribute.label}</label>
                  <em>{attribute.instructions}</em>
                  <input
                    id={attribute.key}
                    name={attribute.key}
                    type="text"
                    min="2"
                    max="150"
                    required={_required}>
                  </input>
                </div>
              );
            }
            else if (attribute.type === 'description' && attribute.input === 'text') {
              // Render a description field
              let _required = '';
              if (attribute.required) {
                _required = "required";
              }
              return (
                <div key={j} className="medium-12 columns">
                  <label htmlFor={attribute.key}>{attribute.label}</label>
                  <em>{attribute.instructions}</em>
                  <textarea
                    id={attribute.key}
                    className='descriptionInput'
                    name={attribute.key}
                    data-min-rows="1"
                    rows="1"
                    required={_required}
                    value={this.state[attribute.key]}
                    onChange={(e)=>this.handleInputChange(e)} >
                  </textarea>
                </div>
              );
            }
            else if (attribute.type === 'decimal' && attribute.input === 'number') {
              // Render Decimal field
              let _required = '';
              if (attribute.required) {
                _required = "required";
              }
              return (
                <div key={j} className="medium-12 columns">
                  <label htmlFor='{attribute.key}'>{attribute.label}</label>
                  <em>{attribute.instructions}</em>
                  <input
                    id={attribute.key}
                    name={attribute.key}
                    type={attribute.input}
                    required={_required}
                    value={this.state[attribute.key]}
                    onChange={(e)=>this.handleInputChange(e)} />
                </div>
              );
            }
            else if (attribute.type === 'int' && attribute.input === 'number') {
              // Render Decimal field
              let _required = '';
              if (attribute.required) {
                _required = "required";
              }
              return (
                <div key={j} className="medium-12 columns">
                  <label htmlFor={attribute.key}>{attribute.label}</label>
                  <em>{attribute.instructions}</em>
                  <input
                    id={attribute.key}
                    name={attribute.key}
                    type={attribute.input}
                    required={_required}
                    value={this.state[attribute.key]}
                    onChange={(e)=>this.handleInputChange(e)} />
                </div>
              );
            }
            else if (attribute.type === 'tags' && attribute.input === 'tags') {
              // Render Tags input
              let _required = '';
              if (attribute.required) {
                _required = "required";
              }

              return (
                <div key={j} className="medium-12 columns">
                  <label htmlFor={attribute.key}>{attribute.label}</label>
                  <em>{attribute.instructions}</em>
                  <input
                    id={attribute.key}
                    name={attribute.key}
                    type={attribute.input}
                    required={_required}
                    value={this.state[attribute.key]}
                    onChange={(e)=>this.handleInputChange(e)} />
                </div>
              );
            }
            else if (attribute.type === 'point' && attribute.input === 'location') {
              return (
                <div key={j} className="medium-12 columns">
                  <label htmlFor={attribute.key}>{attribute.label}</label>
                  <em>{attribute.instructions}</em>
                  <div id={attribute.label} className="map"></div>
                </div>
              );
            }
            else if (attribute.type === 'datetime' && attribute.input === 'date') {
              // Render Date field
              let _required = '';
              if (attribute.required) {
                _required = "required";
              }

              return (
                <div key={j} className="medium-12 columns">
                  <label htmlFor={attribute.key}>{attribute.label}</label>
                  <em>{attribute.instructions}</em>
                  <input
                    id={attribute.key}
                    name={attribute.key}
                    type={attribute.input}
                    required={_required}
                    value={this.state[attribute.key]}
                    onChange={(e)=>this.handleInputChange(e)} />
                </div>
              );
            }
            else if (attribute.type === 'datetime' && attribute.input === 'datetime') {
              // Render Datetime field
              let _required = '';
              if (attribute.required) {
                _required = "required";
              }

              return (
                <div key={j} className="medium-12 columns">
                  <label htmlFor={attribute.key}>{attribute.label}</label>
                  <em>{attribute.instructions}</em>
                  <input
                    id={attribute.key}
                    name={attribute.key}
                    type={attribute.input}
                    required={_required}
                    value={this.state[attribute.key]}
                    onChange={(e)=>this.handleInputChange(e)} />
                </div>
              );
            }
            else if (attribute.type === 'varchar' && attribute.input === 'select') {
              // Render Select field
              let options = []
              for (var jk=0; jk<attribute.options.length; jk++) {

                let _options = <option
                  key={jk}
                  value={attribute.options[jk]}>
                    {attribute.options[jk]}
                </option>
                options[jk] =  _options
              }
              return (
                <div key={j} className="medium-12 columns">
                  <label htmlFor={attribute.key} >{attribute.label}</label>
                  <em>{attribute.instructions}</em>
                  <select id={attribute.key} name={attribute.key} value={this.state[attribute.key]} onChange={(e) => this.handleSelectChange(e)}>
                    {options}
                  </select>
                </div>
              );
            }
            else if (attribute.type === 'varchar' && attribute.input === 'checkbox') {
              // Render Checkboxes field
              let _required = '';
              if (attribute.required) {
                _required = "required";
              }

              let elements = []
              for (var i=0; i<attribute.options.length; i++) {
                let _elements = <span key={i}>
                  <input
                    id={attribute.key + "_" + attribute.options[i].replace(/ /gi,"_")}
                    name={attribute.key}
                    type={attribute.input}
                    value={attribute.options[i]}
                    checked={this.state[attribute.key + "_" + attribute.options[i].replace(/ /gi,"_")]}
                    required={_required}
                    onChange={(e)=>this.handleCheckBoxChange(e)}  />
                  <label htmlFor={attribute.key + "_" + attribute.options[i].replace(/ /gi,"_")}>{attribute.options[i]}</label>
                </span>
                elements[i] =  _elements
              }
              return (
                <div key={j} className="medium-12 columns">
                  <label>{attribute.label}</label>
                  <em>{attribute.instructions}</em>
                  {elements}
                </div>
              );
            }
            else if (attribute.type === 'varchar' && attribute.input === 'radio') {
              // Render Radio field
              let elements = []
              for (var ij=0; ij<attribute.options.length; ij++) {

                let _elements = <span key={ij}>
                  <input
                    id={attribute.key + "_" + attribute.options[ij].replace(/ /gi,"_")}
                    name={attribute.key}
                    type={attribute.input}
                    value={attribute.options[ij]}
                    checked={this.state[attribute.key + "_" + attribute.options[ij].replace(/ /gi,"_")]}
                    required="required"
                    onChange={(e)=>this.handleRadioChange(e)}  />
                  <label htmlFor={attribute.key + "_" + attribute.options[ij].replace(/ /gi,"_")}>{attribute.options[ij]}</label>
                </span>

                elements[ij] = _elements
              }
              return (
                <div key={j} className="medium-12 columns">
                  <label>{attribute.label}</label>
                  <em>{attribute.instructions}</em>
                  {elements}
                </div>
              );
            }
          }
        })

      }

      /**
       * Form container rendition
       */
      return (
        <div className="large-12 columns">
          {stageSet}
          <form name="postForm" onSubmit={this.handleSubmit} noValidate="">
            {attributeSet}
            <button className="button expanded">Submit</button>
          </form>
        </div>
      );
    }
}

export default PostForm;
