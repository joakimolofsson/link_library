import React from 'react'
import { NavLink } from "react-router-dom";
import './css/Nav.css';

const Nav = (props) => {
    return (
        <div className="Nav">
            <ul>
                <li>
                    <NavLink exact to="/home" activeStyle={{color: "red"}}>Home</NavLink>
                </li>
                <li>
                    <NavLink exact to="/profile" activeStyle={{color: "red"}}>Profile</NavLink>
                </li>
                <li onClick={() => {props.handleLogout(true)}}>
                    <NavLink exact to="/"activeStyle={{color: "red"}}>Logout</NavLink>
                </li>
            </ul>
        </div>
    );
}

export default Nav;