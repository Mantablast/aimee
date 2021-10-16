import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import React, { useState } from 'react';

function Nav() {

    return (
        <div className="nav-box">
            <div className="topnav" id="myTopnav">
                <Link className="hvr-float-shadow" to="/">Home</Link>
                <Link className="hvr-float-shadow" to="/about">About</Link>
                <Link className="hvr-float-shadow" to="/skillset">Skillset</Link>
                <Link className="hvr-float-shadow" to="/givingthanks">Giving Thanks</Link>
                <Link className="hvr-float-shadow" to="/contact">Resume + Contact</Link>
            </div>
        </div>
    )
}

export default Nav;