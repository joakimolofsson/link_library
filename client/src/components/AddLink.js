import React, { Component } from 'react';
import './css/AddLink.css';

class AddLink extends Component {
    state = {
        serverMsg: '',
        success: false,
        addLink: {
            link: '',
            description: ''
        }
    }

    handleChange = (e) => {
        this.setState({
            addLink: {
                ...this.state.addLink,
                [e.target.name]: e.target.value
            }
        });
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const postLink = await fetch('api/addlink', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    link: this.state.addLink.link,
                    description: this.state.addLink.description,
                    token: window.localStorage.getItem('token')
                })
            });
            const res = await postLink.json();
            this.handleResponse(res);
        } catch(err) {
            console.log(err);
            this.setState({serverMsg: 'Something went wrong!'});
        }
    }

    handleResponse = (res) => {
        if(res.status === 'success') {
            this.resetInputFields();
            this.setState({
                serverMsg: 'Link was added to the library!',
                success: true
            });
        } else {
            this.setState({
                serverMsg: res.status,
                success: false
            });
        }
    }

    resetInputFields = () => {
        let resetInput = {};
        for(let key in this.state.addLink) {
            resetInput = {...resetInput, [key]: ''}
        }
        this.setState({
            addLink: {
                ...resetInput
            }
        });
    }

    render() {
        return (
            <div className="AddLink">
                <h1>Add a Link to the Library</h1>
                <p className={`message ${this.state.success ? 'success' : ''}`}>{this.state.serverMsg}</p>
                <form className="form" onSubmit={this.handleSubmit}>
                    <input className="inputField" type="text" name="link" maxLength="200" placeholder="Link Address" value={this.state.addLink.link} onChange={this.handleChange} required/>
                    <textarea name="description" cols="54" rows="5" maxLength="150" placeholder="Description" value={this.state.addLink.description} onChange={this.handleChange} required></textarea>
                    <input type="submit" value="Add"/>
                </form>
            </div>
        );
    }
}

export default AddLink;