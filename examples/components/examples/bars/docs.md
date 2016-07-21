In addition to simple formats, you can also supply a cell rendering function, for example to render a little bar visualization for values in a specific column. The cell rendering function takes three args:

 * the `event` that is being rendered in the row
 * the `column` name of the current
 * the `series` itself.
 
In this example the column name is used to apply the function to just the 'uptime' column. The value is then extracted from the event for the current column, though of course you could use other columns too, and then a simple bar is constructed using a div with some styling:

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

And render():

    <Table
        series={availability}
        timeFormat="MMMM, YYYY"
        columns={columns}
        summary={availabilityDataSummary}
        renderCell={renderPercentAsBar} />

