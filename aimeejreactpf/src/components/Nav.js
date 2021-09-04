import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import React, { useState } from 'react';

function Nav() {

    return (
        <div className="nav-box">
            <div className="topnav" id="myTopnav">
                <Link className="hvr-float-shadow" to="/" className="active">Home</Link>
                <Link className="hvr-float-shadow" to="/about">About</Link>
                <Link className="hvr-float-shadow" to="/contact">Contact</Link>
                <Link className="hvr-float-shadow" to="/skillset">Skillset</Link>
                <Link className="hvr-float-shadow" to="/resume">Resume</Link>
                <Link className="hvr-float-shadow" to="/givingthanks">Giving Thanks</Link>
            </div>
        </div>
    )
}

export default Nav;