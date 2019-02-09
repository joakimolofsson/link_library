import React, { Component } from 'react';
import './css/UserInfo.css';

class UserInfo extends Component {
    state = {
        serverMsg: {
            status: ''
        },
        user: {
            firstname: '',
            lastname: '',
            age: '',
            email: '',
            created: ''
        }
    }

    componentDidMount() {
        this.requestUserData();
    }

    requestUserData = async () => {
        try {
            const userData = await fetch('http://localhost:3001/api/userinfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    token: window.localStorage.getItem('token')
                })
            });
            const res = await userData.json();
            if(res.status === 'success') {
                this.setState({
                    user: {
                        firstname: res.userData.firstname,
                        lastname: res.userData.lastname,
                        age: res.userData.age,
                        email: res.userData.email,
                        created: res.userData.created
                    }                 
                });
            } else {
                this.props.handleAuth(false);
                this.props.history.push('/');
            }
        } catch(err) {
            console.log(err);
            this.setState({
                serverMsg: {
                    status: 'Something went wrong!'
                }
            });
        }
    }

    render() {
        return (
            <div className="UserInfo">
            {
                <p>{this.state.serverMsg.status}</p>
            }
                <h2>UserInfo</h2>
                <p>Firstname: {this.state.user.firstname}</p>
                <p>Lastname: {this.state.user.lastname}</p>
                <p>Age: {this.state.user.age}</p>
                <p>E-mail: {this.state.user.email}</p>
                <p>Created: {this.state.user.created}</p>
            </div>
        );
    }
}

export default UserInfo;