import React, { Component } from 'react';
import './css/Links.css';

class Links extends Component {
    state = {
        serverMsg: '',
        success: false,
        linksList: [],
        filters: {
            latest: false,
            oldest: false
        }
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
            this.handleSelectFilter(filter);
            this.handleResponse(res);
        } catch(err) {
            console.log(err);
            this.setState({serverMsg: 'Something went wrong!'});
        }
    }

    handleSelectFilter = (filter) => {
        switch(filter) {
            case 'latest':
                this.setState({
                    filters: {
                        latest: true,
                        oldest: false
                    }
                })
                break;
            case 'oldest':
                this.setState({
                    filters: {
                        latest: false,
                        oldest: true
                    }
                })
                break;
            default:
                break;
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
                <p className={`message ${success}`}>{this.state.serverMsg}</p>

                <div className="filterContainer">
                    <p className={this.state.filters.latest ? 'active': ''} onClick={() => {this.handleFetchLinks('latest')}}>Latest</p>
                    <p className={this.state.filters.oldest ? 'active': ''} onClick={() => {this.handleFetchLinks('oldest')}}>Oldest</p>
                </div>
                
                {this.state.linksList.map((data) => {
                    return (
                        <div key={data.id} className="linkContainer">
                            <a href={data.link} className="link">{data.link}</a>
                            <p className="description">{data.description}</p>
                            <p className="posted">Posted: {data.posted.split('T')[0]}</p>
                        </div>
                    )
                })}
            </div>
        );
    }
}

export default Links;