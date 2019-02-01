import React, { Component } from 'react';
import './css/Login.css';

class Login extends Component {
    state = {
        serverMsg: [],
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
            const loginUser = await fetch('http://localhost:4000/api/', {
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
            
            const serverResponse = await loginUser.json();
            this.handleResponse(serverResponse);
        } catch(err) {
            console.log(`Login Fetch: ${err}`);
        }
    }

    handleResponse = (resp) => {
        this.resetInputFields();
        if(resp[0] === 'success') {
            this.props.history.push("/protected");
        } else {
            this.setState({
                serverMsg: resp
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
                {
                    this.state.serverMsg.map((data, index) => {
                        return <p key={index}>{data}</p>
                    })
                }
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