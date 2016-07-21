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

// Pond
import { TimeSeries } from "pondjs";

// Imports from the charts library
import TimeSeriesTable from "src/table";

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

export default React.createClass({

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

        return (
            <div className="row">
                <div className="col-md-8">
                    <div style={roundedCornerStyle}>
                        <TimeSeriesTable
                            series={availability}
                            timeFormat="MMMM, YYYY"
                            columns={columns}
                            summary={availabilityDataSummary} />
                    </div>
                </div>
            </div>
        );
    }
});
