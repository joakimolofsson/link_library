import React from 'react'
import { NavLink } from "react-router-dom";
import './css/Nav.css';

const Nav = () => {
    return (
        <div className="Nav">
            <ul>
                <li>
                    <NavLink to="/home" activeStyle={{color: "red"}}>Home</NavLink>
                </li>
                <li>
                    <NavLink to="/register" activeStyle={{color: "red"}}>Register</NavLink>
                </li>
                <li>
                    <NavLink to="/userinfo" activeStyle={{color: "red"}}>User Info</NavLink>
                </li>
                <li>
                    <NavLink to="/"activeStyle={{color: "red"}}>Logout</NavLink>
                </li>
            </ul>
        </div>
    );
}

export default Nav;