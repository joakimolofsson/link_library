import React, { Component } from 'react';
import './css/Links.css';

class Links extends Component {
    state = {
        serverMsg: '',
        success: false,
        showLinksCount: 0,
        viewMoreLinks: false,
        linksList: [],
        filter: '',
    }
    
    componentDidMount = async () => {
        await this.fetchLinks('latest');
        
        const links = document.getElementsByClassName('Links')[0];
        links.addEventListener('wheel', this.loadMoreLinks);
    }

    componentDidUpdate = () => {
        const links = document.getElementsByClassName('Links')[0];
        console.log(links.clientWidth);
        console.log(links.scrollWidth);
        if(links.clientWidth === links.scrollWidth) {
            console.log('alike');
        }
    }
    

    fetchLinks = async (activeFilter) => {
        try {
            await this.setFilterAndLinkCount(activeFilter);
            const getLinks = await fetch('api/getlinks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    filter: this.state.filter,
                    showLinksCount: this.state.showLinksCount,
                    token: window.localStorage.getItem('token')
                })
            });
            const res = await getLinks.json();
            await this.fetchLinksResponse(res, activeFilter);
            this.setFontAndSize(this.state.showLinksCount);
            this.setState({viewMoreLinks: false});
        } catch(err) {
            console.log(err);
            this.setState({serverMsg: 'Something went wrong!'});
        }
    }

    setFilterAndLinkCount = (activeFilter) => {
        if(activeFilter === 'viewMore') {
            const serverShowLimit = 20;
            this.setState({
                showLinksCount: this.state.showLinksCount + serverShowLimit
            });
        } else {
            this.setState({
                showLinksCount: 0,
                filter: activeFilter
            });
            const links = document.getElementsByClassName('Links')[0];
            links.scrollLeft = 0;
        }
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

    rateLink = async (newRating, currentRating, linkId) => {
        try {
            const getLinks = await fetch('api/ratelink', {
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

    setFontAndSize = (num) => {
        const closedLinkContainer = document.querySelectorAll('.closedLinkContainer'),
        fontArray = ['Germania One','Margarine','Saira Extra Condensed','Baloo Chettan','Open Sans Condensed','Lora','Lilita One','Indie Flower','Lobster','Pacifico'];
        for(let i = num, len = closedLinkContainer.length; i < len; i++) {
            const randomFont = Math.floor((Math.random() * fontArray.length)),
            randomFontSize = Math.floor((Math.random() * 75) + 25);
            const description = closedLinkContainer[i].getElementsByClassName('description')[0];
            description.style.fontFamily = fontArray[randomFont];
            description.style.fontSize = `${randomFontSize}px`;

            
        }
    }

    openLink = (e) => {
        if(e.currentTarget.classList.contains('closedLinkContainer')) {
            e.currentTarget.classList.add('pulledOutLink');
            e.currentTarget.nextElementSibling.classList.remove('hide');
            e.currentTarget.nextElementSibling.classList.add('show');
            e.currentTarget.nextElementSibling.style.display = 'block';            
        } else if(e.target.classList.contains('openedLinkContainer')) {
            e.currentTarget.previousElementSibling.classList.remove('pulledOutLink');
            e.currentTarget.classList.remove('show');
            e.currentTarget.classList.add('hide');            
            const elem = e.currentTarget;
            setTimeout(function() {
                elem.style.display = 'none';
            }, 1000);            
        }
    }

    loadMoreLinks = (e) => {
        if(e.constructor.name === 'WheelEvent') {
            e.currentTarget.scrollLeft -= -e.deltaY / 2;
        }
        const links = e.currentTarget;
        if(links.scrollLeft > links.scrollWidth - links.clientWidth - 100) {
            if(!this.state.viewMoreLinks) {
                this.setState({viewMoreLinks: true});
                this.fetchLinks('viewMore');
            }
        }
    }

    clickedLink(link) {
        window.open(link, '_blank');
    }

    render() {
        return (
            <div className="Links" onScroll={this.loadMoreLinks}>
                <p className={`message ${this.state.success ? 'success' : ''}`}>{this.state.serverMsg}</p>

                <div className="allLinksContainer">
                    {this.state.linksList.map(link => {
                        return (
                            <div key={link._id} className="linkContainer">
                                <div className="closedLinkContainer" onClick={this.openLink}>
                                    <div className="container">
                                        <p className="description">{link.description}</p>
                                    </div>
                                </div>
                                <div className="openedLinkContainer" onClick={this.openLink}>
                                    <div className="container">
                                        <p className="link" onClick={() => {this.clickedLink(link.link)}}>{link.link}</p>
                                        <p className="description">{link.description}</p>
                                        
                                        <p className="posted">Added by: {link.firstname} {link.lastname} {link.posted.split('T')[0]}</p>
                                        <div className="rateContainer">
                                            <p className={link.rating === 'like' ? 'rated' : ''} onClick={() => {this.rateLink('like', link.rating, link._id)}}>Likes: {link.like}</p>
                                            <p className={link.rating === 'dislike' ? 'rated' : ''} onClick={() => {this.rateLink('dislike', link.rating, link._id)}}>Dislikes: {link.dislike}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="filterContainer">
                    <p className={this.state.filter === 'latest' ? 'active': ''} onClick={() => {this.fetchLinks('latest')}}>Latest</p>
                    <p className={this.state.filter === 'oldest' ? 'active': ''} onClick={() => {this.fetchLinks('oldest')}}>Oldest</p>
                    <p className={this.state.filter === 'like' ? 'active': ''} onClick={() => {this.fetchLinks('like')}}>Likes</p>
                    <p className={this.state.filter === 'dislike' ? 'active': ''} onClick={() => {this.fetchLinks('dislike')}}>DisLikes</p>
                </div>
            </div>
        );
    }
}

export default Links;