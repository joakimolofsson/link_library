import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './css/Nav.css';

class Nav extends Component {
    state = {
        showLinks: false,
        members: 0
    }

    componentDidMount = () => {
        this.handleAllMembers();
    }

    handleAllMembers = async () => {
        try {
            const requstMembers = await fetch('http://localhost:3001/api/nav', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    token: window.localStorage.getItem('token')
                })
            });
            const res = await requstMembers.json();
            this.handleResponse(res);
        } catch(err) {
            console.log(err);
            this.setState({members: 'Something went wrong!'});
        }
    }

    handleResponse = (res) => {
        if(res.status === 'success') {
            this.setState({members: res.allMembers});
        } else {
            this.setState({members: res.status});
        }
    }

    handleShowLinks  = () => {
        this.setState((state) => {
            return {showLinks: !state.showLinks}
        });
    }

    render() {
        const showLinks = this.state.showLinks ? 'showLinks' : '';
        return (
            <div className={`Nav ${showLinks}`}>
                <h1>Share a Link</h1>
                <div className="infoContainer">
                    <p>Members: {this.state.members}</p>
                    <p>Shared links: 0</p>
                </div>
                
                <div className="hamBarContainer" onClick={this.handleShowLinks}>
                    <div className={this.state.showLinks ? 'hamBarOpen' : 'hamBarClosed'}></div>
                </div>
    
                <div className={`linksContainer ${showLinks}`}>
                    <Link to="/links" onClick={this.handleShowLinks}>Links</Link>
                    <Link to="/sharelink" onClick={this.handleShowLinks}>Share a Link</Link>
                    <Link to="/profile" onClick={this.handleShowLinks}>Profile</Link>
                    <Link to="/" onClick={() => {this.props.handleLogout(true)}}>Log out</Link>
                </div>
            </div>
        );
    }
}

export default Nav;