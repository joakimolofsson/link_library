import React, { Component } from 'react';
import './css/ShareLink.css';

class ShareLink extends Component {
    state = {
        serverMsg: '',
        success: false,
        shareLink: {
            link: '',
            description: ''
        }
    }

    handleChange = (e) => {
        this.setState({
            shareLink: {
                ...this.state.shareLink,
                [e.target.name]: e.target.value
            }
        });
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const postLink = await fetch('http://localhost:3001/api/sharelink', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    link: this.state.shareLink.link,
                    description: this.state.shareLink.description,
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
                serverMsg: 'Thanks for sharing!',
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
        for(let key in this.state.shareLink) {
            resetInput = {...resetInput, [key]: ''}
        }
        this.setState({
            shareLink: {
                ...resetInput
            }
        });
    }

    render() {
        const success = this.state.success ? 'success' : '';
        return (
            <div className="ShareLink">
                <h1>Share a Link</h1>
                <p className={`message ${success}`}>{this.state.serverMsg}</p>
                <form className="form" onSubmit={this.handleSubmit}>
                    <input className="inputField" type="text" name="link" placeholder="Link Address" value={this.state.shareLink.link} onChange={this.handleChange} required/>
                    <textarea name="description" cols="54" rows="5" placeholder="Description" value={this.state.shareLink.description} onChange={this.handleChange} required></textarea>
                    <input type="submit" value="Share"/>
                </form>
            </div>
        );
    }
}

export default ShareLink;