import React, { Component } from 'react';
import './css/Login.css';

class Login extends Component {
    state = {
        serverMsg: [],
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
            this.handleResponse(serverResponse);
        } catch(err) {
            console.log(`Fetch: ${err}`);
        }
    }

    handleResponse = (resp) => {
        if(resp[0] === 'success') {
            this.props.history.push("/protected");
        } else {
            this.setState({
                serverMsg: resp
            });
        }
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
                    <input type="email" name="email" value={this.state.email} onChange={this.handleChange} />
                    <p>Password:</p>
                    <input type="password" name="password" value={this.state.password} onChange={this.handleChange} />
                    <br/>
                    <input type="submit" value="Login"/>
                </form>
            </div>
        );
    }
}

export default Login;