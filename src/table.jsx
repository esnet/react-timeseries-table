/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import _ from "underscore";
import { format } from "d3-format";
import Moment from "moment";

import { TimeSeries, IndexedEvent } from "pondjs";

export default React.createClass({

    displayName: "Table",

    getDefaultProps() {
        return {
            width: 300
        };
    },

    propTypes: {
        /**
         * A pond.js TimeSeries to display as a Table
         */
        series: React.PropTypes.instanceOf(TimeSeries).isRequired,

        /**
         * Specify which columns to render. This is an array of object,
         * where each object is a column. The object contains the `key`,
         * which is the column name, the `label` which is how the column
         * header will actually display the column name, and a `format`,
         * which is a d3.format.
         * ```
         * const columns = [
         *    {key: "time", label: "Month"},
         *    {key: "uptime", label: "Availability"},
         *    {key: "outages", label: "Outages", format: paddedCounterFormat}
         * ];
         * ```
         */
        columns: React.PropTypes.array,

        /**
         * Sort by a column in the TimeSeries. Default is to sort by the timestamp.
         */
        sortBy: React.PropTypes.string,

        /**
         * Reverses the sort direction
         */
        reverse: React.PropTypes.bool,

        /**
         * A function which returns the contents of the cell. The function
         * is called with three arguments:
         *  * The `event` being rendered
         *  * The `column` being rendered
         *  * The `series` being rendered
         *
         * For example here is a function that will render a mini-bar within
         * each cell:
         *
         * ```
         * function renderPercentAsBar(event, column) {
         *     if (column === "uptime") {
         *         const value = parseFloat(event.data().get(column));
         *         const v = `${value}%`;
         *         const barStyle = {
         *             background: "steelblue",
         *             color: "white",
         *             paddingLeft: 2,
         *             width: v
         *         };
         *         return (
         *             <div width="100%" style={{background: "#E4E4E4"}}>
         *                 <div style={barStyle}>{v}</div>
         *             </div>
         *         );
         *     }
         * }
         * ```
         */
        renderCell: React.PropTypes.func,

        /**
         * A d3 time format string. e.g. "MMMM, YYYY"
         */
        timeFormat: React.PropTypes.string,

        /**
         * Width of the table
         */
        width: React.PropTypes.number,

        /**
         * An object describing a summary line at the bottom of the table.
         * The object's keys are the column names, and the values are
         * what will be rendered in the cell. For example:
         *
         * const availabilityDataSummary = {
         *     time: "Past year",
         *     uptime: `${percentFormat(availability.avg("uptime") / 100)}`,
         *     outages: `${paddedCounterFormat(availability.sum("outages"))}`
         * };
         */
        summary: React.PropTypes.object

    },

    renderCells(event) {
        const cells = [];

        if (this.props.columns) {
            _.each(this.props.columns, (column) => {
                let cell;
                if (this.props.renderCell) {
                    cell = this.props.renderCell(event, column.key, this.props.series);
                }

                if (cell) {
                    cells.push(
                        <td key={column.key}>{cell}</td>
                    );
                } else {
                    let formatter;
                    if (column.format) {
                        if (_.isFunction(column.format)) {
                            formatter = column.format;
                        } else if (_.isString(column.format)) {
                            formatter = format(column.format);
                        }
                    }

                    if (column.key === "time") {
                        if (event instanceof IndexedEvent) {
                            const format = this.props.timeFormat;
                            const eventIndex =
                                event.index().toNiceString(format);
                            cells.push(
                                <td key={event.index().asString()}>
                                    {eventIndex}
                                </td>
                            );
                        } else {
                            const ts = Moment(event.timestamp());
                            cells.push(
                                <td key={ts.valueOf()}>
                                    {ts.format(this.props.timeFormat)}
                                </td>
                            );
                        }
                    } else {
                        let value = event.data().get(column.key);
                        if (formatter) {
                            value = formatter(parseFloat(value, 10));
                        }
                        cells.push(
                            <td key={column.key}>{value}</td>
                        );
                    }
                }
            });
        } else {
            if (event instanceof IndexedEvent) {
                cells.push(
                    <td key={event.index().asString()}>
                        {event.index().toNiceString(this.props.timeFormat)}
                    </td>
                );
            } else {
                const ts = Moment(event.timestamp());
                cells.push(
                    <td key={ts.valueOf()}>
                        {ts.format(this.props.timeFormat)}
                    </td>
                );
            }

            event.data().forEach((d, i) => {
                let cell;
                if (this.props.renderCell) {
                    cell = this.props.renderCell(event, i);
                }

                if (cell) {
                    cells.push(
                        <td key={i}>{cell}</td>
                    );
                } else {
                    cells.push(
                        <td key={i}>{d.toString()}</td>
                    );
                }
            });
        }

        return cells;
    },

    renderRows() {
        const rows = [];

        const events = [];
        for (const event of this.props.series.events()) {
            events.push(event);
        }

        const { sortBy, reverse } = this.props;

        if (sortBy) {
            events.sort((a, b) => {
                const aa = reverse ? a : b;
                const bb = reverse ? b : a;
                if (aa.get(sortBy) < bb.get(sortBy)) {
                    return -1;
                }
                if (aa.get(sortBy) > bb.get(sortBy)) {
                    return 1;
                }
                return 0;
            });
        } else if (reverse === false) {
            events.reverse();
        }

        let i = 0;
        for (const event of events) {
            rows.push(
                <tr key={i}>{this.renderCells(event)}</tr>
            );
            i++;
        }

        const summaryStyle = {
            backgroundColor: "#ECECEC",
            borderTop: "#E0E0E0",
            borderTopWidth: 1,
            borderTopStyle: "solid"
        };

        if (this.props.summary) {
            const cells = _.map(this.props.summary, (value, key) => (
                <td key={key}><b>{value}</b></td>
            ));
            rows.push(
                <tr key="summary" style={summaryStyle}>{cells}</tr>
            );
        }

        return rows;
    },

    renderHeader() {
        const headerCells = [];
        const headerStyle = {borderTop: "none"};
        if (this.props.columns) {
            _.each(this.props.columns, (column) => {
                headerCells.push(
                    <th key={column.label}
                        style={headerStyle}>{column.label}</th>
                );
            });
        } else {
            headerCells.push(
                <th key="time">time</th>
            );
            this.props.series._columns.forEach((column) => {
                headerCells.push(
                    <th key={column.label} style={headerStyle}>{column}</th>
                );
            });
        }

        return (
            <tr key="header">
                {headerCells}
            </tr>
        );
    },

    render() {
        const style = {marginBottom: 0};

        return (
            <table className="table table-condensed table-striped"
                   width={this.props.width}
                   style={style}>
                <tbody>
                    {this.renderHeader()}
                    {this.renderRows()}
                </tbody>
            </table>
        );
    }
});
