import React from 'react'
import { Link } from "react-router-dom";

import './css/Nav.css';

const Nav = () => {
    return (
        <div className="Nav">
            <ul>
                <li>
                    <Link to="/">Login</Link>
                </li>
                <li>
                    <Link to="/register/">Register</Link>
                </li>
                <li>
                    <Link to="/protected/">Protected</Link>
                </li>
            </ul>
        </div>
    );
}

export default Nav;