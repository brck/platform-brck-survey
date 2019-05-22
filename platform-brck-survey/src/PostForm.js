// React native imports
import React, { Component } from 'react';
import Map from 'react-js-google-maps';

// Code imports
import * as api from './helpers/fetchData';
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import './FormStyles.css'

const markers = [];

class PostForm extends Component {
    constructor() {
      super();
      this.state = {
        formState: {
        },
        zoom: 4,
        lat: 3,
        lng: 25.044,
        mapMarkers: []
      }
    }

    componentDidMount() {
      this.prepStates()

    }

    initMap = (map, ref) => {
      this.setMapOnAll(map);

      map.addListener('click', async (e) => {
        let lat = e.latLng.lat();
        let lng = e.latLng.lng();

        await this.addMarker(map, e.latLng, ref);

        await map.panTo(new window.google.maps.LatLng(lat,lng));

        this.setState({
          [ref]: {"lat":lat, "lon":lng}
        })

      });

      return false;
    };

    addMarker(map, location, ref) {
      var marker = new window.google.maps.Marker({
        position: location,
        map: map,
        ref: ref
      });
      markers[0] = marker;
    }

    setMapOnAll(map) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        map.panTo(new window.google.maps.LatLng(markers[i].getPosition().lat(),markers[i].getPosition().lng()));
        map.setCenter(markers[i].getPosition());
      }
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
      const _checkBox = event.target;
      const _key = _checkBox.attributes.name.value
      const _ref = _checkBox.attributes.value.value.replace(/ /gi,"_")

      let valObj = this.state[_key].split(", ")

      if (_checkBox.checked) {
        this.setState({[_key + "_" + _ref]: true})
        if (valObj[0] === "") {
          valObj[0] = _checkBox.attributes.value.value
        } else {
          valObj.push(_checkBox.attributes.value.value)
        }
      } else {
        this.setState({[_key + "_" + _ref]: false})
        for (var i=valObj.length-1; i>=0; i--) {
            if (valObj[i] === _checkBox.attributes.value.value) {
                valObj.splice(i, 1);
                break;
            }
        }
      }

      this.setState({[_key]: valObj.join(", ")})
    }

    handleRadioChange = (event) => {
      let _radio = event.target;
      let _key = _radio.attributes.name.value
      let _ref = _radio.attributes.value.value.replace(/ /gi,"_")

      if (_radio.checked) {
        this.setState({[_key + "_" + _ref]: true})
      } else {
        this.setState({[_key + "_" + _ref]: false})
      }

      this.setState({[_key]: _radio.attributes.value.value})
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

    handleUserId = (elemKey) => {
      if (this.state[elemKey] !== undefined) {
        // this.setState({[elemKey]: this.props.uid});
      }
    }
    /**
     * Form submit handling
     */
    handleSubmit = async (event) => {
      event.preventDefault();

      let formTitle = ""
      let formDescription = ""
      let formId = this.props.stages.results[0].form_id
      let uid = this.props.uid

      let _payloadData = {}
      let payloadData = {}

      const formElements = this.props.attributes.results

      if (formElements !== undefined) {
        for (var i=0; i<formElements.length; i++) {
          if (formElements[i].type === 'title' && formElements[i].input === 'text') {
            formTitle = formElements[i].label;
          }
          if (formElements[i].type === 'description' && formElements[i].input === 'text') {
            formDescription = formElements[i].label;
          }

          if (formElements[i].label === "User ID") {
            _payloadData[formElements[i].key] = [uid];
          } else if (this.state[formElements[i].label] !== "" && this.state[formElements[i].key] !== undefined) {
            _payloadData[formElements[i].key] = [this.state[formElements[i].key]]
          }
        }

        for (var j=0; j<formElements.length; j++) {
          payloadData[formElements[j].key] = _payloadData[formElements[j].key]
        }
      }

      let postData = {
        "title": formTitle,
        "content":formDescription,
        "values": payloadData,
        "form":{
          "id": formId
        }
      }

      if (!this.state.accessToken) {
        api.getToken().then((response) => {
          this.setState({ accessToken: response.access_token });
        })
        .then(() => api.sendFormData(postData, this.state.accessToken).then(response => {
          if (response.ok) {
            this.setState({ submitted: true });
          }
        }));
      } else {
        api.sendFormData(postData, this.state.accessToken).then(response => {
          if (response.ok) {
            this.setState({ submitted: true });
          }
        });
      }
    }

    /**
     * Form rendition engine
     */

    render() {
      if (this.state.submitted) {
        window.parent.postMessage('complete', '*');
        return (
          <div className="large-12 columns callout-top-margin">
            <div className="callout success">
              <h3>Submitted </h3><hr />
              <p className="callout-message">You have submitted the form successfully.</p>
            </div>
          </div>
        )
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
              // Render title
              return (
                <div key={j} className="medium-12 columns">
                  <h2>{attribute.label}</h2>
                  <em><small>{attribute.instructions}</small></em>
                </div>
              );
            }
            else if (attribute.type === 'description' && attribute.input === 'text') {
              // Render a description field
              return (
                <div key={j} className="medium-12 columns">
                  <p>
                    <strong>{attribute.label}</strong>
                    <br />
                    <em><small>{attribute.instructions}</small></em>
                  </p>
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
                  <label htmlFor={attribute.key}><strong>{attribute.label}</strong></label>
                  <em><small>{attribute.instructions}</small></em>
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
            else if (attribute.type === 'varchar' && attribute.input === 'text') {
              // Render Decimal field
              let _required = '';
              if (attribute.required) {
                _required = "required";
              }
              if (attribute.label === "User ID") {
                return (
                  <div key={j} className="medium-12 columns">
                    <input
                      id={attribute.key}
                      name={attribute.key}
                      type='hidden'
                      required={_required}
                      value={this.props.uid}
                      onChange={(e)=>this.handleInputChange(e)} />
                  </div>
                );
              } else {
                return (
                  <div key={j} className="medium-12 columns">
                    <label htmlFor={attribute.key}><strong>{attribute.label}</strong></label>
                    <em><small>{attribute.instructions}</small></em>
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
            }
            else if (attribute.type === 'text' && attribute.input === 'textarea') {
              // Render Decimal field
              let _required = '';
              if (attribute.required) {
                _required = "required";
              }
              return (
                <div key={j} className="medium-12 columns">
                  <label htmlFor={attribute.key}><strong>{attribute.label}</strong></label>
                  <em><small>{attribute.instructions}</small></em>
                  <textarea
                    id={attribute.key}
                    name={attribute.key}
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
                  <label htmlFor={attribute.key}><strong>{attribute.label}</strong></label>
                  <em><small>{attribute.instructions}</small></em>
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
                  <label htmlFor={attribute.key}><strong>{attribute.label}</strong></label>
                  <em><small>{attribute.instructions}</small></em>
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
              const mapOptions = {
                zoom: 10,
                center: { lat: -1.35, lng: 36.7 }
              }

              return (
                <div key={j} className="medium-12 columns">
                  <label htmlFor={attribute.key}><strong>{attribute.label}</strong></label>
                  <em><small>{attribute.instructions}</small></em>
                  <div id={attribute.label} className="map">
                    <Map
                      id="map"
                      apiKey="AIzaSyAPDk9dEGoSmus29wHWjddbv1Q34fWcIBE"
                      mapOptions={mapOptions}
                      style={{ width: '100%', height: 480 }}
                      onLoad={(e) => {
                        this.initMap(e, attribute.key);
                      }}
                    />
                  </div>
                </div>
              );
            }
            else if (attribute.type === 'datetime' && attribute.input === 'date') {
              // Render Date field
              return (
                <div key={j} className="medium-12 columns">
                  <label htmlFor={attribute.key}><strong>{attribute.label}</strong></label>
                  <em><small>{attribute.instructions}</small></em>
                  <DatePicker
                    id={attribute.key}
                    name={attribute.key}
                    type={attribute.input}
                    required={attribute.required}
                    selected={this.state[attribute.key] !== "" ? this.state[attribute.key] : null}
                    onChange={(date)=>{
                      this.setState({
                        [attribute.key]: date
                      });
                    }}
                    dateFormat="MMM dd, yyyy"
                    />
                </div>
              );
            }
            else if (attribute.type === 'datetime' && attribute.input === 'datetime') {
              // Render Datetime field
              return (
                <div key={j} className="medium-12 columns">
                  <label htmlFor={attribute.key}><strong>{attribute.label}</strong></label>
                  <em><small>{attribute.instructions}</small></em>
                  <DatePicker
                    id={attribute.key}
                    name={attribute.key}
                    type={attribute.input}
                    required={attribute.required}
                    selected={this.state[attribute.key] !== "" ? this.state[attribute.key] : null}
                    onChange={(dateTime)=>{
                      this.setState({
                        [attribute.key]: dateTime
                      });
                    }}
                    showTimeSelect
                    dateFormat="MMM dd, yyyy HH:mm" />
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
                  <label htmlFor={attribute.key}><strong>{attribute.label}</strong></label>
                  <em><small>{attribute.instructions}</small></em>
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
                  <br />
                </span>
                elements[i] =  _elements
              }
              return (
                <div key={j} className="medium-12 columns">
                  <p><label><strong>{attribute.label}</strong></label>
                  <em><small>{attribute.instructions}</small></em></p>
                  {elements}
                </div>
              );
            }
            else if (attribute.type === 'varchar' && attribute.input === 'radio') {
              // Render Radio field
              let elements = []

              let _required = '';
              if (attribute.required) {
                _required = "required";
              }

              for (var ij=0; ij<attribute.options.length; ij++) {
                let _elements = <span key={ij}>
                  <input
                    id={attribute.key + "_" + attribute.options[ij].replace(/ /gi,"_")}
                    name={attribute.key}
                    type={attribute.input}
                    value={attribute.options[ij]}
                    required={_required}
                    onChange={(e)=>this.handleRadioChange(e)}
                    defaultChecked={this.state[attribute.key + "_" + attribute.options[ij].replace(/ /gi,"_")]} />
                  <label htmlFor={attribute.key + "_" + attribute.options[ij].replace(/ /gi,"_")}>{attribute.options[ij]}</label>
                  <br />
                </span>

                elements.push(_elements)
              }
              return (
                <div key={j} className="medium-12 columns">
                  <label><strong>{attribute.label}</strong></label>
                  <em><small>{attribute.instructions}</small></em>
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
