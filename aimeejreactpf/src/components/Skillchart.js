import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import React, { useState } from 'react';
import { ResponsivePie } from '@nivo/pie';
function Skillchart() {
    const data =
        [
            {
                "id": "React",
                "label": "React",
                "value": 265,
                "color": "hsl(222, 70%, 50%)"
            },
            {
                "id": "Css",
                "label": "Css",
                "value": 188,
                "color": "hsl(305, 70%, 50%)"
            },
            {
                "id": "Javascript",
                "label": "Javascript",
                "value": 418,
                "color": "hsl(104, 70%, 50%)"
            },
            {
                "id": "Node",
                "label": "Node",
                "value": 200,
                "color": "hsl(104, 70%, 50%)"
            },
            {
                "id": "MySql",
                "label": "MySql",
                "value": 100,
                "color": "hsl(104, 70%, 50%)"
            },
            {
                "id": "MongoDB",
                "type": "patternDots",
                "label": "MongoDB",
                "value": 100,
                "color": "hsl(104, 70%, 50%)"
            },
        ]
    const MyResponsivePie = ({ data })
    return (
        <div>
            <div className="chart-style">
            <ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        colors={{ scheme: 'red_purple' }}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#fdfcfc"
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
                    id: 'React'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'Css'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'Javascript'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'Node'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'MySql'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'MongoDB'
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
                itemTextColor: '#fdfcfc',
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#fcfcfc'
                        }
                    }
                ]
            }
        ]}
    />
                    </div>
        </div>
    )
}

export default Skillchart;