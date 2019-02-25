import React, { Component } from 'react';
import './css/Post.css';

class Post extends Component {
    state = {
        serverMsg: '',
        success: false,
    }
    
    handleSubmit = (e) => {
        e.preventDefault();
        console.log('submit');
    }

    render() {
        const success = this.state.success ? 'success' : '';
        return (
            <div className="Post">
                <h1>Share a Link</h1>
                <p className={`message ${success}`}>{this.state.serverMsg}</p>
                <form className="form" onSubmit={this.handleSubmit}>
                    <input className="inputField" type="text" placeholder="Link Address" />
                    <textarea cols="53" rows="5" placeholder="Description"></textarea>
                    <input type="submit" value="Share"/>
                </form>
            </div>
        );
    }
}

export default Post;