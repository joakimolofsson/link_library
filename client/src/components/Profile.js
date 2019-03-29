import React, { Component } from 'react';
import './css/Profile.css';

class Profile extends Component {
    state = {
        serverMsg: '',
        success: false,
        profile: {
            firstname: '',
            lastname: '',
            age: '',
            email: '',
            password: '',
            confimPassword: ''
        }
    }

    componentDidMount = () => {
        this.handleProfileData();
    }

    handleProfileData = async () => {
        try {
            const getProfile = await fetch('api/profile', {
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
                        firstname: res.profileData.firstname,
                        lastname: res.profileData.lastname,
                        age: res.profileData.age,
                        email: res.profileData.email,
                        password: '',
                        confimPassword: ''
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

    handleConfirmPassword = () => {
        const password = this.state.profile.password;
        const confirmPassword = this.state.profile.confimPassword;
        if(password !== confirmPassword) {
            return false;
        }
        return true;
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        if(this.handleConfirmPassword()) {
            try {
                const updateProfile = await fetch('api/profile_edit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
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
        } else {
            this.setState({serverMsg: 'Passwords doesn\'t match!'});
        }
    }

    handleResponse = (res) => {
        if(res.status === 'success') {
            window.localStorage.setItem('token', res.token);
            this.setState({
                serverMsg: 'Profile updated!',
                success: true
            });
        } else {
            this.setState({
                serverMsg: res.status,
                success: false
            });
        }
    }

    render() {
        return (
            <div className="Profile">
                <h1>Your Profile</h1>
                <p className={`message ${this.state.success ? 'success' : ''}`}>{this.state.serverMsg}</p>
                <form className="form" onSubmit={this.handleSubmit}>
                    <input className="inputField" type="text" name="firstname" placeholder="Firstname" value={this.state.profile.firstname} onChange={this.handleChange} required/>
                    <input className="inputField" type="text" name="lastname" placeholder="Lastname" value={this.state.profile.lastname} onChange={this.handleChange} required/>
                    <input className="inputField" type="text" name="age" placeholder="Age" value={this.state.profile.age} onChange={this.handleChange} required/>
                    <input className="inputField" type="email" name="email" placeholder="E-mail" value={this.state.profile.email} onChange={this.handleChange} required/>
                    <input className="inputField" type="password" name="password" placeholder="Password" value={this.state.profile.password} onChange={this.handleChange} />
                    <input className="inputField lastInputField" type="password" name="confimPassword" placeholder="Confim Password" value={this.state.profile.confimPassword} onChange={this.handleChange} />
                    <input type="submit" value="Update"/>
                </form>
            </div>
        );
    }
}

export default Profile;