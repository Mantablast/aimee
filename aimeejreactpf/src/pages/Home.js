import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useState } from 'react';
import { Pie, Doughnut } from 'react-chartjs-2';

function Home() {
    const state = {
        labels: ['January', 'February', 'March',
            'April', 'May'],
        datasets: [
            {
                label: 'Rainfall',
                backgroundColor: [
                    '#B21F00',
                    '#C9DE00',
                    '#2FDE00',
                    '#00A6B4',
                    '#6800B4'
                ],
                hoverBackgroundColor: [
                    '#501800',
                    '#4B5000',
                    '#175000',
                    '#003350',
                    '#35014F'
                ],
                data: [65, 59, 80, 81, 56]
            }
        ]
    }
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
                <div>
                    <Pie
                        data={state}
                        options={{
                            title: {
                                display: true,
                                text: 'Average Rainfall per month',
                                fontSize: 20
                            },
                            legend: {
                                display: true,
                                position: 'right'
                            }
                        }}
                    />

                    <Doughnut
                        data={state}
                        options={{
                            title: {
                                display: true,
                                text: 'Average Rainfall per month',
                                fontSize: 20
                            },
                            legend: {
                                display: true,
                                position: 'right'
                            }
                        }}
                    />
                </div>
            </section>
        </div>
    )
}

export default Home;