import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import React, { useState } from 'react';

function About() {

    return (
        <div>
            <div className="topNav">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/skillset">Skillset</Link>
            <Link to="/resume">Resume</Link>
            </div>
        </div>
    )
}

export default About;