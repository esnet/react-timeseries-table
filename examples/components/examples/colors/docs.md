An example of using a cell rendering function. Here we define a function to color code one of the columns by its value.

    function renderPercentAsColor(event, column) {
        if (column === "uptime") {
            const value = parseFloat(event.data().get(column));
            if (value < 90) {
                return (
                    <b style={{color: "red"}}>{`${value}%`}</b>
                );
            } else if (value < 95) {
                return (
                    <b style={{color: "orange"}}>{`${value}%`}</b>
                );
            } else {
                return (
                    <span style={{color: "green"}}>{`${value}%`}</span>
                );
            }
        }
    }

And render():

    <Table
        series={availability}
        timeFormat="MMMM, YYYY"
        columns={columns}
        summary={availabilityDataSummary}
        renderCell={renderPercentAsColor} />
