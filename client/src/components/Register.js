import React, { Component } from 'react';
import './css/Register.css';

class Register extends Component {
    state = {
        serverMsg: '',
        success: false,
        userInput: {
            firstname: '',
            lastname: '',
            age: '',
            email: '',
            password: '',
            confimPassword: ''
        }
    }

    handleChange = (e) => {
        this.setState({
            userInput: {
                ...this.state.userInput,
                [e.target.name]: e.target.value
            }
        });
    }

    handleConfirmPassword = () => {
        const password = this.state.userInput.password;
        const confirmPassword = this.state.userInput.confimPassword;
        if(password !== confirmPassword) {
            return false;
        }
        return true;
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        if(this.handleConfirmPassword()) {
            try {
                const registerUser = await fetch(window.location.href + 'api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        firstname: this.state.userInput.firstname,
                        lastname: this.state.userInput.lastname,
                        age: this.state.userInput.age,
                        email: this.state.userInput.email,
                        password: this.state.userInput.password
                    })
                });
                
                const res = await registerUser.json();
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
            this.resetInputFields();
            this.setState({
                serverMsg: 'New User Registered!',
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
        for(let key in this.state.userInput) {
            resetInput = {...resetInput, [key]: ''}
        }
        this.setState({
            userInput: {
                ...resetInput
            }
        });
    }

    render() {
        return (
            <div className="Register">
                <h1>Link Library</h1>
                <p className={`message ${this.state.success ? 'success' : ''}`}>{this.state.serverMsg}</p>
                <form className="form" onSubmit={this.handleSubmit}>
                    <input className="inputField" type="text" name="firstname" placeholder="Firstname" value={this.state.userInput.firstname} onChange={this.handleChange} required/>
                    <input className="inputField" type="text" name="lastname" placeholder="Lastname" value={this.state.userInput.lastname} onChange={this.handleChange} required/>
                    <input className="inputField" type="text" name="age" placeholder="Age" value={this.state.userInput.age} onChange={this.handleChange} required/>
                    <input className="inputField" type="email" name="email" placeholder="E-mail" value={this.state.userInput.email} onChange={this.handleChange} required/>
                    <input className="inputField" type="password" name="password" placeholder="Password" value={this.state.userInput.password} onChange={this.handleChange} required/>
                    <input className="inputField lastInputField" type="password" name="confimPassword" placeholder="Confim Password" value={this.state.userInput.confimPassword} onChange={this.handleChange} required/>
                    <input type="submit" value="Sign up!"/>
                </form>
                <p className="option" onClick={() => {this.props.history.push("/")}}>Back</p>
            </div>
        );
    }
}

export default Register;