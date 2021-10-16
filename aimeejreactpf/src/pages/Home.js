import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useState } from "react";
import Skillchart from "../components/Skillchart";
import Timeline from "../components/Timeline";
import Projects from "../components/Projects";

function Home() {
    return (
        <div>
            <section className="hero">
                <div className="hero-inner">
                    <div className="hero-greeting">
                        <h3>Hi, I'm Aimee</h3>
                        <img
                            className="herosmallimg"
                            src={
                                "https://user-images.githubusercontent.com/71906988/131229581-8ff06d38-54d5-48a6-84b7-8568b55937e0.png"
                            }
                        />
                        <h4>Welcome to my portfolio</h4>
                    </div>
                    
                </div>
            </section>
            <section className="skill-blocks">
                <div className="sk-container">
                    <div className="sk-container">
                    </div>
                        <Skillchart />
                        <Timeline />
                        <Projects />
                </div>
            </section>

        </div>
    );
}

export default Home;
