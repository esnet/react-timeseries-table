In this example a TimeSeries of measurement data is used. The difference here is that each event in the TimeSeries is timestamped rather than being an Index:

    const measurementData = {
        "name": "stats",
        "columns": ["time", "value"],
        "points": [
            [1400425941000, 0.13],
            [1400425942000, 0.18],
            [1400425943000, 0.13],
            ...
        ]
    };

    const measurements = new TimeSeries(measurementData);

    const measurementColumns = [
        {key: "time", label: "Timestamp"},
        {key: "value", label: "Measurement", format: "%"},
    ];

And render():

    <Table
        series={measurements}
        timeFormat="h:mm:ss a"
        columns={measurementColumns} />

