import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useState } from 'react';

function Home() {

    return (
        <div>
            <section className="hero">
                <div className="hero-inner">
                    <div className="hero-greeting">
                        <h3>Hi, I'm Aimee</h3>
                        <img className="herosmallimg" src={'https://user-images.githubusercontent.com/71906988/131229581-8ff06d38-54d5-48a6-84b7-8568b55937e0.png'} />
                    </div>
                    <h4>Welcome to my portfolio</h4>
                </div>
            </section>
            <section id="skillset">
                
            </section>
        </div>
    )
}

export default Home;