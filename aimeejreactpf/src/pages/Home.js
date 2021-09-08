import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useState } from "react";
import Skillchart from "../components/Skillchart";
import Timeline from "../components/Timeline";

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
                    </div>
                    <h4>Welcome to my portfolio</h4>
                </div>
            </section>
            <div className="skill-blocks">
                <section id="skillset">
                    <div className="skill-titles">
                        <h2>Skillset</h2>
                        <h4>Last Updated</h4>
                    </div>
                    <Skillchart />
                </section>
                <section>
                    <div className="skill-titles">
                        <h2>Timeline</h2>
                        <h4>Last Updated</h4>
                    <Timeline />
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Home;
