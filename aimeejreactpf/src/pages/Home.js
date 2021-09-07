import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useState } from "react";
import { ResponsivePie } from '@nivo/pie';

function Home() {
    const data = 
    [
        {
          "id": "ruby",
          "label": "ruby",
          "value": 418,
          "color": "hsl(143, 70%, 50%)"
        },
        {
          "id": "lisp",
          "label": "lisp",
          "value": 265,
          "color": "hsl(272, 70%, 50%)"
        },
        {
          "id": "css",
          "label": "css",
          "value": 188,
          "color": "hsl(305, 70%, 50%)"
        },
        {
          "id": "rust",
          "label": "rust",
          "value": 319,
          "color": "hsl(64, 70%, 50%)"
        },
        {
          "id": "javascript",
          "label": "javascript",
          "value": 222,
          "color": "hsl(104, 70%, 50%)"
        }
      ]
    const MyResponsivePie = ({data}) 
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
                <div className="chart-style">
                <ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: 'color', modifiers: [ [ 'darker', 2 ] ] }}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        fill={[
            {
                match: {
                    id: 'ruby'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'c'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'go'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'python'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'scala'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'lisp'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'elixir'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'javascript'
                },
                id: 'lines'
            }
        ]}
        legends={[
            {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 56,
                itemsSpacing: 0,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: '#999',
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#000'
                        }
                    }
                ]
            }
        ]}
    />

                </div>
            </section>
            <section>
                <div className="skill-titles">
                    <h2>Timeline</h2>
                    <h4>Last Updated</h4>
                </div>
            </section>
            </div>
        </div>
    );
}

export default Home;
