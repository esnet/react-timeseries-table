/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

/* eslint max-len:0 */

import React from "react";
import { format } from "d3-format";
import { TimeSeries } from "pondjs";
import Table from "src/table";

const percentFormat = format(".1%");
const paddedCounterFormat = format("04d");

const availabilityData = {
    name: "availability",
    columns: ["index", "uptime", "notes", "outages"],
    points: [
        ["2014-07", 100, "", 2],
        ["2014-08", 88, "", 17],
        ["2014-09", 95, "", 6],
        ["2014-10", 99, "", 3],
        ["2014-11", 91, "", 14],
        ["2014-12", 99, "", 3],
        ["2015-01", 100, "", 0],
        ["2015-02", 92, "",12],
        ["2015-03", 99, "Minor outage March 2", 4],
        ["2015-04", 87, "Planned downtime in April", 82],
        ["2015-05", 92, "Router failure June 12", 26],
        ["2015-06", 100, "", 0]
    ]
};

const columns = [
    {key: "time", label: "Month"},
    {key: "uptime", label: "Availability"},
    {key: "outages", label: "Outages", format: paddedCounterFormat}
];

function renderPercentAsBar(event, column) {
    if (column === "uptime") {
        const value = parseFloat(event.data().get(column));
        const v = `${value}%`;
        const barStyle = {
            background: "steelblue",
            color: "white",
            paddingLeft: 2,
            width: v
        };
        return (
            <div width="100%" style={{background: "#E4E4E4"}}>
                <div style={barStyle}>{v}</div>
            </div>
        );
    }
}

export default React.createClass({

    getInitialState() {
        return {
            sortBy: null,
            reverse: false
        }
    },

    setDefaultProps() {
        return {
            indexFormat: null
        };
    },

    render() {
        const availability = new TimeSeries(availabilityData);

        const availabilityDataSummary = {
            time: "Past year",
            uptime: `${percentFormat(availability.avg("uptime") / 100)}`,
            outages: `${paddedCounterFormat(availability.sum("outages"))}`
        };

        const roundedCornerStyle = {
            borderRadius: 5,
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: "#DDDDDD",
            overflow: "auto"
        };

        const linkStyle = {
            color: "#7395b1",
            cursor: "pointer",
            fontWeight: 100,
            margin: 2
        };

        const linkStyleActive = {
            color: "steelblue",
            fontWeight: 800,
            cursor: "pointer",
            margin: 2
        };

        const { sortBy, reverse } = this.state;

        return (
            <div>
                <div className="row" style={{paddingBottom: 10}}>
                    <div className="col-md-8">
                        <span style={{fontWeight: 800}}>Sort by: </span>
                        <span style={sortBy === null ? linkStyleActive : linkStyle} onClick={() =>
                            this.setState({sortBy: null})}>Date</span><span>|</span>
                        <span style={sortBy === "uptime" ? linkStyleActive : linkStyle} onClick={() =>
                            this.setState({sortBy: "uptime"})}>Availability</span><span>|</span>
                        <span style={sortBy === "outages" ? linkStyleActive : linkStyle} onClick={() =>
                            this.setState({sortBy: "outages"})}>Outages</span>
                        <span style={{padding: 10}} />

                        <span style={{fontWeight: 800}}>Direction: </span>
                        <span style={reverse === true ? linkStyleActive : linkStyle} onClick={() =>
                            this.setState({reverse: true})}>Asc</span><span>|</span>
                        <span style={reverse === false ? linkStyleActive : linkStyle} onClick={() =>
                            this.setState({reverse: false})}>Desc</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8">
                        <div style={roundedCornerStyle}>
                            <Table
                                series={availability}
                                sortBy={this.state.sortBy}
                                reverse={this.state.reverse}
                                timeFormat="MMMM, YYYY"
                                columns={columns}
                                summary={availabilityDataSummary}
                                renderCell={renderPercentAsBar} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
