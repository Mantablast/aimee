import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import React, { useState } from 'react';
import { ResponsiveBullet } from '@nivo/bullet';
function Timeline() {
    const data = [
        {
            "id": "temp.",
            "ranges": [
                42,
                22,
                116,
                0,
                140
            ],
            "measures": [
                63
            ],
            "markers": [
                103
            ]
        },
        {
            "id": "power",
            "ranges": [
                0.17036287050261573,
                0.4748054303378107,
                0.6176135263001483,
                0,
                2
            ],
            "measures": [
                0.03400869326207631,
                1.5973273580923357
            ],
            "markers": [
                1.8221489005030789
            ]
        },
        {
            "id": "volume",
            "ranges": [
                13,
                43,
                9,
                33,
                7,
                23,
                0,
                60
            ],
            "measures": [
                13
            ],
            "markers": [
                57
            ]
        },
        {
            "id": "cost",
            "ranges": [
                129610,
                50406,
                124973,
                0,
                500000
            ],
            "measures": [
                121994,
                122742
            ],
            "markers": [
                418034
            ]
        },
        {
            "id": "revenue",
            "ranges": [
                2,
                7,
                5,
                0,
                13
            ],
            "measures": [
                9
            ],
            "markers": [
                9.229069819408306,
                10.744325932109728
            ]
        }
    ]
    const MyResponsiveBullet = ({ data })
    return (
        <div className="timeline-chart">
            <ResponsiveBullet
                data={data}
                margin={{ top: 25, right: 45, bottom: 25, left: 45 }}
                spacing={46}
                titleAlign="start"
                titleOffsetX={-70}
                measureSize={0.2}
            />
        </div>
    )
}

export default Timeline;