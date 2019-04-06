import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './css/Nav.css';

class Nav extends Component {
    state = {
        dropDown: false,
        members: 0,
        links: 0
    }

    componentDidMount = () => {
        this.handleNavInfo();
    }

    handleNavInfo = async () => {
        try {
            const requstMembers = await fetch('api/nav', {
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
            this.setState({
                members: res.allMembers,
                links: res.allLinks
            });
        } else {
            this.setState({members: res.status});
        }
    }

    handledropDown  = () => {
        this.setState((state) => {
            return {dropDown: !state.dropDown}
        });
    }

    render() {
        const dropDown = this.state.dropDown ? 'dropDown' : '';
        return (
            <div className={`Nav ${dropDown}`}>
                <h1>Link Library</h1>
                <div className="infoContainer">
                    <p>Members: {this.state.members}</p>
                    <p>Links in Library: {this.state.links}</p>
                </div>
                
                <div className="hamBarContainer" onClick={this.handledropDown}>
                    <div className={this.state.dropDown ? 'hamBarOpen' : 'hamBarClosed'}></div>
                </div>
    
                <div className={`navContainer ${dropDown}`}>
                    <Link to="/links" onClick={this.handledropDown}>Links</Link>
                    <Link to="/addlink" onClick={this.handledropDown}>Add a Link</Link>
                    <Link to="/profile" onClick={this.handledropDown}>Profile</Link>
                    <Link to="/" onClick={() => {this.props.handleLogout(true)}}>Log out</Link>
                </div>
            </div>
        );
    }
}

export default Nav;