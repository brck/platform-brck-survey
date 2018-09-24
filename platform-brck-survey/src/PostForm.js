import React, { Component } from 'react';
import * as api from './helpers/fetchData';
import TitleInputComponent from './TitleInputComponent';
import DescriptionInput from './DescriptionInput';
import InputComponent from './InputComponent';

import './App.css';
import './FormStyles.css'

class PostForm extends Component {
    constructor()
    {
        super();
        this.state = {
            formState: {
            },
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log('Doing submit:', event);

        //TODO: this is sample payload data -- we still need to copy form state to the appropirate places
        const payloadData = {"title":"this was sent from react, but it has a 402","content":"fdsa","locale":"en_US","values":{"2037b58d-0d83-456b-80ab-6a905b34f172":["dfdas"],"1b6e7b7f-7ee3-4f24-b83b-1d9c9e47733a":["afds"],"9ca15c6f-0ec9-4c95-8936-edbc94274941":["fdsa"],"ad2e7d2c-102e-4564-9e71-6405cb509c11":["Checkbox option 1"]},"completed_stages":[],"published_to":[],"post_date":"2018-09-20T22:14:16.698Z","form":{"id":2,"url":"http://localhost:8000/api/v3/forms/2","parent_id":null,"name":"More complicated Test Survey","description":null,"color":null,"type":"report","disabled":false,"created":"2018-09-18T20:27:34+00:00","updated":null,"hide_author":false,"hide_time":false,"hide_location":false,"require_approval":true,"everyone_can_create":true,"targeted_survey":false,"can_create":[],"tags":[],"allowed_privileges":["read","create","update","delete","search"]},"allowed_privileges":["read","create","update","delete","search","change_status","read_full"]};

        if (!this.state.accessToken) {
            console.log('there is no token.');
            api.getToken().then((response) => {
            console.log('oauth response: ', response);
            console.log('oauth token: ', response.access_token);
            this.setState({accessToken: response.access_token});
            })
            .then(() => api.sendFormData(payloadData, this.state.accessToken).then(response => {
                console.log('post form response: ', response );
                if(response.ok)
                {
                    this.setState({submitted: true});
                }
            }));
        }else { 
            api.sendFormData(payloadData, this.state.accessToken).then(response => {
                console.log('post form response already having token: ', response );
                if(response.ok)
                {
                    this.setState({submitted: true});
                }
            });
        }

    }

  render() {
    if(this.state.submitted)
    {
        return (<div>Submitted!</div>)
    }

    let stageSet = 'Loading...';
    if(this.props.stages)
    {
        stageSet = this.props.stages.results.map( function(aStage)
        {
            return <div key={aStage.name}>{aStage.label}</div>;
        })
    }
    let attributeSet = '';
    if(this.props.attributes.results)
    {
        console.log('here are all the props:', this.props);
        attributeSet = this.props.attributes.results.map( function(attribute)
        {
            //lots of conditional stuff here...
            //@TODO: refactor this into its own module
            if (attribute.type === 'title')
            {
                return <TitleInputComponent attribute={attribute} />;
            }
            else if (attribute.type === 'description')
            {
                return (<DescriptionInput attribute={attribute} />)
            }
            else if (attribute.type === 'tags')
            {
                return <div>{attribute.label}</div>;
            }
            else if (attribute.type === 'varchar')
            {                
                return <InputComponent attribute={attribute}/>;
            }
            else if (attribute.type === 'text' && attribute.input === 'text')
            {
                return <InputComponent attribute={attribute}/>;

            }
            else if (attribute.type === 'text' && attribute.input === 'checkbox')
            {
                return <InputComponent attribute={attribute}/>;
            }
            else
            {
                return <div>{attribute.label} : {attribute.type} </div>;
            }
        })
    }
    console.log('this props: ', this.props);

    return (
      <div className="form">
        <form name="postForm" onSubmit={this.handleSubmit} noValidate="">
        {stageSet}
        {attributeSet}
        <button>Submit</button>
        </form>
      </div>
    );
  }
}

export default PostForm;
