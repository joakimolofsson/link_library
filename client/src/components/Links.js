import React, { Component } from 'react';
import './css/Links.css';

class Links extends Component {
    state = {
        serverMsg: '',
        success: false,
        showLinksCount: 0,
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
        try {
            const getLinks = await fetch('http://localhost:3001/api/getlinks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    filterOption,
                    showLinksCount: this.state.showLinksCount,
                    token: window.localStorage.getItem('token')
                })
            });
            const res = await getLinks.json();
            this.setState({showLinksCount: this.state.showLinksCount + 5});
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
            const newLinksList = this.addRatingToLinks(res.links, res.userRatedLinks);
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

    addRatingToLinks = (links, userRatedLinks) => {
        for(let i = 0, iLen = links.length; i < iLen; i++) {
            for(let j = 0, jLen = userRatedLinks.length; j < jLen; j++) {
                if(links[i]._id === userRatedLinks[j].linkId) {
                    links[i].rating = userRatedLinks[j].rating;
                }
            }
            if(links[i].rating === undefined) {
                links[i].rating = 'none';
            }
        }
        return links;
    }

    rateLink = async (newRating, currentRating, linkId) => {
        try {
            const getLinks = await fetch('http://localhost:3001/api/ratelink', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    newRating,
                    currentRating,
                    linkId,
                    token: window.localStorage.getItem('token')
                })
            });
            const res = await getLinks.json();
            this.rateLinkResponse(res, newRating);
        } catch(err) {
            console.log(err);
            this.setState({serverMsg: 'Something went wrong!'});
        }
    }

    rateLinkResponse = (res, newRating) => {
        if(res.status === 'success') {
            window.localStorage.setItem('token', res.token);
            const newLinksList = this.state.linksList.map(link => {
                if(link._id === res.newLink._id) {
                    if(res.linkStatus === 'removed') {
                        res.newLink.rating = 'none';
                    } else {
                        res.newLink.rating = newRating;
                    }
                    return res.newLink;
                }
                return link;
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
                    {this.state.linksList.map(link => {
                        return (
                            <div key={link._id} className="linkContainer">
                                <a href={link.link} className="link">{link.link}</a>
                                <p className="description">{link.description}</p>
                                
                                <p className="posted">Added by: {link.firstname} {link.lastname} {link.posted.split('T')[0]}</p>
                                <div className="rateContainer">
                                    <p className={link.rating === 'like' ? 'rated' : ''} onClick={() => {this.rateLink('like', link.rating, link._id)}}>Like: {link.like}</p>
                                    <p className={link.rating === 'dislike' ? 'rated' : ''} onClick={() => {this.rateLink('dislike', link.rating, link._id)}}>Dislike: {link.dislike}</p>
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