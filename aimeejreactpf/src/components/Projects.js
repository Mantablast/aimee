import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import React, { useState } from 'react';

function Projects() {
    
    return (
        <div className="font-white">
            <h2>Projects Section</h2>
            <div className="project-container">
                <div className="projects">
                Project 1
                </div>
                <div className="projects">
                Project 2
                </div>
                <div className="projects">
                Project 3
                </div>
                <div className="projects">
                Project 4
                </div>
                <div className="projects">
                Project 5
                </div>
                <div className="projects">
                Project 6
                </div>
            </div>
        </div>
    )
}

export default Projects;