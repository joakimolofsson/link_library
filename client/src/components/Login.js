import React, { Component } from 'react';
import './css/Login.css';

class Login extends Component {
    state = {
        message: '',
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
            const loginUser = await fetch('http://localhost:4000/api/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password
                })
            });
            
            const serverResponse = await loginUser.json();
            this.handleResponse(serverResponse.status);
        } catch(err) {
            console.log(err);
        }
    }

    handleResponse = (resp) => {
        switch(resp) {
            case 'success':
                this.props.history.push("/protected");
                break;
            case 'failed':
                this.setState({
                    message: 'Wrong E-mail or Password!',
                    email: '',
                    password: ''
                });
                break;
            case 'error':
                this.setState({
                    message: 'Something Went Wrong!',
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
            <div className="Login">
                <h2>Login</h2>
                <p>{this.state.message}</p>
                <form onSubmit={this.handleSubmit}>
                    <p>E-mail:</p>
                    <input type="email" name="email" value={this.state.email} onChange={this.handleChange} required/>
                    <p>Password:</p>
                    <input type="password" name="password" value={this.state.password} onChange={this.handleChange} required/>
                    <br/>
                    <input type="submit" value="Login"/>
                </form>
            </div>
        );
    }
}

export default Login;