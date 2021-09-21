import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import React, { useState } from 'react';

function Projects() {
    
    return (
        <div className="font-white">
            <h2>Projects Section</h2>
            <div className="project-container">
            <a href="https://w4tch-tow3r.herokuapp.com/" className="projects proj1 gradient-box">
                </a>
                <div className="projects proj2 gradient-box">
                
                </div>
                <div className="projects proj3 gradient-box">
                
                </div>
                <div className="projects proj4 gradient-box">
                
                </div>
                <div className="projects proj5 gradient-box">
                
                </div>
                <div className="projects proj6 gradient-box">
                
                </div>
            </div>
        </div>
    )
}

export default Projects;