
Tables are generated from a TimeSeries.

In the above example, the points in the TimeSeries are indexed based on the month:

    const availabilityData = {
        "name": "availability",
        "columns": ["index", "uptime", "notes", "outages"],
        "points": [
            ["2015-06", 100, "", 0],
            ["2015-05", 92, "Router failure June 12", 26],
            ["2015-04", 87, "Planned downtime in April", 82],
            ["2015-03", 99, "Minor outage March 2", 4],
            ...
        ]
    };

    const availability = new TimeSeries(availabilityData);

    const columns = [
        {key: "time", label: "Timestamp"},
        {key: "uptime", label: "Availability"},
        {key: "outages", label: "Outages", format: "04d"}
    ];

And render():

    <TimeSeriesTable series={availability} timeFormat="MMMM, YYYY" columns={columns} />

Optionally they can choose which columns to display. The above example defined the `columns` to specify this.

Each column they can also specify the format (using a d3.format) to use to display that column.
