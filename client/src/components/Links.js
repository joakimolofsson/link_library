import React, { Component } from 'react';
import './css/Links.css';

class Links extends Component {
    state = {
        serverMsg: '',
        success: false,
        linksList: []
    }
    
    componentDidMount = () => {
        this.handleFetchLinks('latest');
    }

    handleFetchLinks = async (filter) => {
        try {
            const getLinks = await fetch('http://localhost:3001/api/links', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    sort: filter
                })
            });
            const res = await getLinks.json();
            this.handleResponse(res);
        } catch(err) {
            console.log(err);
            this.setState({serverMsg: 'Something went wrong!'});
        }
    }

    handleResponse = (res) => {
        if(res.status === 'success') {
            this.setState({
                success: true,
                linksList: res.linksList
            });
        } else {
            this.setState({
                serverMsg: res.status,
                success: false
            });
        }
    }

    render() {
        const success = this.state.success ? 'success' : '';
        return (
            <div className="Links">
                <h1>Links</h1>
                <p onClick={() => {this.handleFetchLinks('latest')}}>Latest</p>
                <p onClick={() => {this.handleFetchLinks('oldest')}}>Oldest</p>
                <p className={`message ${success}`}>{this.state.serverMsg}</p>
                {this.state.linksList.map((data) => {
                    return (
                        <div key={data.id}>
                            <a href={data.link}>{data.link}</a>
                            <p>{data.description}</p>
                            <p>{data.posted}</p>
                        </div>
                    )
                })}
            </div>
        );
    }
}

export default Links;