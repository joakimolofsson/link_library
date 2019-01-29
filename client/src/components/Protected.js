import React, { Component } from 'react';

class Protected extends Component {
    state = {

    }

    async componentDidMount() {
        /* const userData = await fetch('http://localhost:4000/api/protected');
        const user = await userData.json();

        console.log(user); */
    }

    render() {
        return (
            <div className="Protected">
                <h2>This site is protected!</h2>
            </div>
        );
    }
}

export default Protected;