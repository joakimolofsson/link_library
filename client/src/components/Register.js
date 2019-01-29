import React, { Component } from 'react';
import './css/Register.css';

class Register extends Component {
    state = {
        message: '',
        firstname: '',
        lastname: '',
        age: '',
        email: '',
        password: ''
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const registerUser = await fetch('http://localhost:4000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    firstname: this.state.firstname,
                    lastname: this.state.lastname,
                    age: this.state.age,
                    email: this.state.email,
                    password: this.state.password
                })
            });
            
            const serverResponse = await registerUser.json();
            console.log(serverResponse);
            //this.handleResponse(serverResponse.status);
        } catch(err) {
            console.log(err);
        }
    }

    handleResponse = (resp) => {
        switch(resp) {
            case 'success':
                this.setState({
                    message: 'New User Registered!',
                    firstname: '',
                    lastname: '',
                    age: '',
                    email: '',
                    password: ''
                });
                break;
            case 'failed':
                this.setState({
                    message: 'Failed to Register New User!',
                    firstname: '',
                    lastname: '',
                    age: '',
                    email: '',
                    password: ''
                });
                break;
            case 'error':
                this.setState({
                    message: 'Something Went Wrong!',
                    firstname: '',
                    lastname: '',
                    age: '',
                    email: '',
                    password: ''
                });
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <div className="Register">
                <h2>Register</h2>
                <p>{this.state.message}</p>
                <form onSubmit={this.handleSubmit}>
                    <p>Firstname:</p>
                    <input type="text" name="firstname" value={this.state.firstname} onChange={this.handleChange} />
                    <p>Lastname:</p>
                    <input type="text" name="lastname" value={this.state.lastname} onChange={this.handleChange} />
                    <p>Age:</p>
                    <input type="text" name="age" value={this.state.age} onChange={this.handleChange} />
                    <p>E-mail:</p>
                    <input type="text" name="email" value={this.state.email} onChange={this.handleChange} />
                    <p>Password:</p>
                    <input type="text" name="password" value={this.state.password} onChange={this.handleChange} />
                    <br/>
                    <input type="submit" value="Register"/>
                </form>
            </div>
        );
    }
}

export default Register;