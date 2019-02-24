import React, { Component } from 'react';
import './css/Profile.css';

class Profile extends Component {
    state = {
        serverMsg: '',
        profile: {
            id: '',
            firstname: '',
            lastname: '',
            age: '',
            email: '',
            password: ''
        }
    }

    componentDidMount = () => {
        this.handleProfileData();
    }

    handleProfileData = async () => {
        try {
            const getProfile = await fetch('http://localhost:3001/api/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    token: window.localStorage.getItem('token')
                })
            });
            const res = await getProfile.json();
            if(res.status === 'success') {
                this.setState({
                    profile: {
                        id: res.profileData._id,
                        firstname: res.profileData.firstname,
                        lastname: res.profileData.lastname,
                        age: res.profileData.age,
                        email: res.profileData.email,
                        password: ''
                    }                 
                });
            } else {
                this.props.handleAuth(false);
                this.props.history.push('/');
            }
        } catch(err) {
            console.log(err);
            this.setState({serverMsg: 'Something went wrong!'});
        }
    }

    handleChange = (e) => {
        this.setState({
            profile: {
                ...this.state.profile,
                [e.target.name]: e.target.value
            }
        });
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updateProfile = await fetch('http://localhost:3001/api/profile_edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    id: this.state.profile.id,
                    firstname: this.state.profile.firstname,
                    lastname: this.state.profile.lastname,
                    age: this.state.profile.age,
                    email: this.state.profile.email,
                    password: this.state.profile.password,
                    token: window.localStorage.getItem('token')
                })
            });

            const res = await updateProfile.json();
            this.handleResponse(res);
        } catch(err) {
            console.log(err);
            this.setState({serverMsg: 'Something went wrong!'});
        }
    }

    handleResponse = (res) => {
        if(res.status === 'success') {
            window.localStorage.setItem('token', res.token);
            this.setState({serverMsg: 'Profile updated!'});
        } else {
            this.setState({serverMsg: res.status});
        }
    }

    render() {
        return (
            <div className="Profile">
                {
                    <p>{this.state.serverMsg}</p>
                }
                <form onSubmit={this.handleSubmit}>
                    <p>Firstname:</p>
                    <input type="text" name="firstname" value={this.state.profile.firstname} onChange={this.handleChange} />
                    <p>Lastname:</p>
                    <input type="text" name="lastname" value={this.state.profile.lastname} onChange={this.handleChange} />
                    <p>Age:</p>
                    <input type="text" name="age" value={this.state.profile.age} onChange={this.handleChange} />
                    <p>E-mail:</p>
                    <input type="email" name="email" value={this.state.profile.email} onChange={this.handleChange} />
                    <p>Password:</p>
                    <input type="password" name="password" value={this.state.profile.password} onChange={this.handleChange} />
                    <br/>
                    <input type="submit" value="Update"/>
                </form>
            </div>
        );
    }
}

export default Profile;