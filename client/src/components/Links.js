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
            oldest: false,
            like: false,
            dislike: false,
        }
    }
    
    componentDidMount = () => {
        this.fetchLinks('latest');
    }

    fetchLinks = async (activeFilter) => {
        try {
            const getLinks = await fetch('http://localhost:3001/api/getlinks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    filter: await this.setFilterAndLinkCount(activeFilter),
                    showLinksCount: this.state.showLinksCount,
                    token: window.localStorage.getItem('token')
                })
            });
            const res = await getLinks.json();
            this.fetchLinksResponse(res, activeFilter);
        } catch(err) {
            console.log(err);
            this.setState({serverMsg: 'Something went wrong!'});
        }
    }

    setFilterAndLinkCount = (activeFilter) => {
        for(let filter in this.state.filters) {
            if(activeFilter === [filter][0]) {
                this.setState(prevState => ({
                    showLinksCount: 0,
                    filters: {
                        ...prevState.filters,
                        [filter]: true
                    }
                }));
            } else if(activeFilter === 'viewMore') {
                this.setState({
                    showLinksCount: this.state.showLinksCount + 5
                });
                if(this.state.filters[filter]) {
                    return [filter][0];
                }
            } else {
                this.setState(prevState => ({
                    filters: {
                        ...prevState.filters,
                        [filter]: false
                    }
                }));
            }
        }
        return activeFilter;
    }

    addRatingToLinks = (links, userRatedLinks) => {
        if(userRatedLinks !== undefined) {
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
        }
        return links;
    }

    fetchLinksResponse = (res, activeFilter) => {
        if(res.status === 'success') {
            const newLinksList = this.addRatingToLinks(res.links, res.userRatedLinks);
            if(activeFilter === 'viewMore') {
                this.setState(prevState => ({
                    success: true,
                    linksList: [...prevState.linksList, ...newLinksList]
                }));
            } else {
                this.setState({
                    success: true,
                    linksList: newLinksList
                });
            }
        } else {
            this.setState({
                serverMsg: res.status,
                success: false
            });
        }
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
                        <p className={this.state.filters.like ? 'active': ''} onClick={() => {this.fetchLinks('like')}}>Likes</p>
                        <p className={this.state.filters.dislike ? 'active': ''} onClick={() => {this.fetchLinks('dislike')}}>DisLikes</p>
                    </div>
                </div>
                
                <p onClick={() => {this.fetchLinks('viewMore')}}>Load More</p>

                <div className="wip_container">
                    {this.state.linksList.map(link => {
                        return (
                            <div key={link._id} className="linkContainer">
                                <a href={link.link} className="link">{link.link}</a>
                                <p className="description">{link.description}</p>
                                
                                <p className="posted">Added by: {link.firstname} {link.lastname} {link.posted.split('T')[0]}</p>
                                <div className="rateContainer">
                                    <p className={link.rating === 'like' ? 'rated' : ''} onClick={() => {this.rateLink('like', link.rating, link._id)}}>Likes: {link.like}</p>
                                    <p className={link.rating === 'dislike' ? 'rated' : ''} onClick={() => {this.rateLink('dislike', link.rating, link._id)}}>Dislikes: {link.dislike}</p>
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