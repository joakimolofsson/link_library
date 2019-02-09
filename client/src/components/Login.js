import React, { Component } from 'react';
import './css/Login.css';

class Login extends Component {
    state = {
        serverMsg: {
            status: ''
        },
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
            const loginUser = await fetch('http://localhost:3001/api/', {
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
            this.setState({
                serverMsg: {
                    status: 'Something went wrong!'
                }
            });
        }
    }

    handleResponse = (res) => {
        this.resetInputFields();
        if(res.status === 'success') {
            window.localStorage.setItem('token', res.token);
            this.props.handleAuth(true);
            this.props.history.push("/home");
        } else {
            this.setState({
                serverMsg: {
                    status: res.status
                }
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
            <div className="Login">
                <h2>Login</h2>
                <p>{this.state.serverMsg.status}</p>
                <form onSubmit={this.handleSubmit}>
                    <p>E-mail:</p>
                    <input type="email" name="email" value={this.state.userInput.email} onChange={this.handleChange} />
                    <p>Password:</p>
                    <input type="password" name="password" value={this.state.userInput.password} onChange={this.handleChange} />
                    <br/>
                    <input type="submit" value="Login"/>
                </form>
            </div>
        );
    }
}

export default Login;