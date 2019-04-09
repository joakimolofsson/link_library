import React, { Component } from 'react';
import './css/Login.css';

class Login extends Component {
    state = {
        serverMsg: '',
        userInput: {
            email: '',
            password: ''
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

    handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const loginUser = await fetch('api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: this.state.userInput.email,
                    password: this.state.userInput.password
                })
            });
            
            const res = await loginUser.json();
            this.handleResponse(res);
        } catch(err) {
            console.log(err);
            this.setState({serverMsg: 'Something went wrong!'});
        }
    }

    handleResponse = (res) => {
        this.resetPassword();
        if(res.status === 'success') {
            window.localStorage.setItem('token', res.token);
            window.localStorage.setItem('loggedIn', new Date().getTime());
            this.props.history.push("/links");
        } else {
            this.setState({serverMsg: res.status});
        }
    }

    resetPassword = () => {
        this.setState({
            userInput: {
                email: this.state.userInput.email,
                password: ''
            }
        });
    }

    render() {
        return (
            <div className="Login">
                <div className="container">
                    <h1>Link Library</h1>
                    <p className="message">{this.state.serverMsg}</p>
                    <form className="form" onSubmit={this.handleSubmit}>
                        <input className="inputField" type="email" name="email" placeholder="E-mail" value={this.state.userInput.email} onChange={this.handleChange} required/>
                        <input className="inputField lastInputField" type="password" name="password" placeholder="Password" value={this.state.userInput.password} onChange={this.handleChange} required/>
                        <p className="option firstOption">Forgot password?</p>
                        <input type="submit" value="Log In"/>
                    </form>
                    <div className="optionContainer">
                        <p className="option">Don't have an account?</p>
                        <p className="option lastOption" onClick={() => {this.props.history.push("/register")}}>Sign up!</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;