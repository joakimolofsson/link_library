import React, { Component } from 'react';
import './css/Links.css';

class Links extends Component {
    state = {
        serverMsg: '',
        success: false,
        linkCount: 0,
        linksList: [],
        filters: {
            latest: false,
            oldest: false
        }
    }
    
    componentDidMount = () => {
        this.fetchLinks('latest');
    }

    fetchLinks = async (filterOption) => {
        this.setState({linkCount: this.state.linkCount + 5});
        try {
            const getLinks = await fetch('http://localhost:3001/api/getlinks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    filterOption,
                    linkCount: this.state.linkCount,
                    token: window.localStorage.getItem('token')
                })
            });
            const res = await getLinks.json();
            this.styleFilterBtn(filterOption);
            this.fetchLinksResponse(res);
        } catch(err) {
            console.log(err);
            this.setState({serverMsg: 'Something went wrong!'});
        }
    }

    styleFilterBtn = (filterOption) => {
        switch(filterOption) {
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

    fetchLinksResponse = (res) => {
        if(res.status === 'success') {
            const newLinksList = this.checkWhichLinksAreRated(res.userRatedLinks, res.links);
            this.setState(prevState => ({
                success: true,
                linksList: [...prevState.linksList, ...newLinksList]
            }));
        } else {
            this.setState({
                serverMsg: res.status,
                success: false
            });
        }
    }

    checkWhichLinksAreRated = (userRatedLinks, links) => {
        for(let i = 0, iLen = userRatedLinks.length; i < iLen; i++) {
            for(let j = 0, jLen = links.length; j < jLen; j++) {
                if(userRatedLinks[i].linkId === links[j]._id) {
                    links[j].rating = userRatedLinks[i].rating;
                }
            }
        }
        return links;
    }

    rateLink = async (rating, linkId) => {
        try {
            const getLinks = await fetch('http://localhost:3001/api/ratelink', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    rating,
                    linkId,
                    token: window.localStorage.getItem('token')
                })
            });
            const res = await getLinks.json();
            this.rateLinkResponse(res, rating, linkId);
        } catch(err) {
            console.log(err);
            this.setState({serverMsg: 'Something went wrong!'});
        }
    }

    rateLinkResponse = (res, rating, linkId) => {
        if(res.status === 'success') {
            window.localStorage.setItem('token', res.token);
            
            const newLinksList = this.state.linksList.map(data => {
                if(data._id === linkId) {
                    switch(rating) {
                        case 'like':
                            data.like = data.like + 1;
                            data.rating = rating;
                            return {...data};
                        case 'dislike':
                            data.dislike = data.dislike + 1;
                            data.rating = rating;
                            return {...data};
                        default:
                            return {...data};
                    }
                }
                return {...data};
            });
            this.setState({linksList : newLinksList});
        } else {
            this.setState({
                serverMsg: res.status,
                success: false
            });
        }
    }

    render() {
        return (
            <div className="Links">
                <div className="titleContainer">
                    <h1>Links</h1>
                    <p className={`message ${this.state.success ? 'success' : ''}`}>{this.state.serverMsg}</p>

                    <div className="filterContainer">
                        <p className={this.state.filters.latest ? 'active': ''} onClick={() => {this.fetchLinks('latest')}}>Latest</p>
                        <p className={this.state.filters.oldest ? 'active': ''} onClick={() => {this.fetchLinks('oldest')}}>Oldest</p>
                    </div>
                </div>
                
                <p onClick={() => {this.fetchLinks('latest')}}>Load More</p>

                <div className="wip_container">
                    {this.state.linksList.map(data => {
                        return (
                            <div key={data._id} className="linkContainer">
                                <a href={data.link} className="link">{data.link}</a>
                                <p className="description">{data.description}</p>
                                
                                <p className="posted">Added by: {data.firstname} {data.lastname} {data.posted.split('T')[0]}</p>
                                <div className="rateContainer">
                                    <p className={data.rating === 'like' ? 'rated' : ''} onClick={() => {this.rateLink('like', data._id)}}>Like: {data.like}</p>
                                    <p className={data.rating === 'dislike' ? 'rated' : ''} onClick={() => {this.rateLink('dislike', data._id)}}>Dislike: {data.dislike}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
}

export default Links;