"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _d3Format = require("d3-format");

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _pondjs = require("pondjs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({

    displayName: "Table",

    getDefaultProps: function getDefaultProps() {
        return {
            width: 300
        };
    },


    propTypes: {
        /**
         * A pond.js TimeSeries to display as a Table
         */
        series: _react2.default.PropTypes.instanceOf(_pondjs.TimeSeries).isRequired,

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
        columns: _react2.default.PropTypes.array,

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
        renderCell: _react2.default.PropTypes.func,

        /**
         * A d3 time format string. e.g. "MMMM, YYYY"
         */
        timeFormat: _react2.default.PropTypes.string,

        /**
         * Width of the table
         */
        width: _react2.default.PropTypes.number,

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
        summary: _react2.default.PropTypes.object

    },

    renderCells: function renderCells(event) {
        var _this = this;

        var cells = [];

        if (this.props.columns) {
            _underscore2.default.each(this.props.columns, function (column) {
                var cell = void 0;
                if (_this.props.renderCell) {
                    cell = _this.props.renderCell(event, column.key, _this.props.series);
                }

                if (cell) {
                    cells.push(_react2.default.createElement(
                        "td",
                        { key: column.key },
                        cell
                    ));
                } else {
                    var formatter = void 0;
                    if (column.format) {
                        if (_underscore2.default.isFunction(column.format)) {
                            formatter = column.format;
                        } else if (_underscore2.default.isString(column.format)) {
                            formatter = (0, _d3Format.format)(column.format);
                        }
                    }

                    if (column.key === "time") {
                        if (event instanceof _pondjs.IndexedEvent) {
                            var _format = _this.props.timeFormat;
                            var eventIndex = event.index().toNiceString(_format);
                            cells.push(_react2.default.createElement(
                                "td",
                                { key: event.index().asString() },
                                eventIndex
                            ));
                        } else {
                            var ts = (0, _moment2.default)(event.timestamp());
                            cells.push(_react2.default.createElement(
                                "td",
                                { key: ts.valueOf() },
                                ts.format(_this.props.timeFormat)
                            ));
                        }
                    } else {
                        var value = event.data().get(column.key);
                        if (formatter) {
                            value = formatter(parseFloat(value, 10));
                        }
                        cells.push(_react2.default.createElement(
                            "td",
                            { key: column.key },
                            value
                        ));
                    }
                }
            });
        } else {
            if (event instanceof _pondjs.IndexedEvent) {
                cells.push(_react2.default.createElement(
                    "td",
                    { key: event.index().asString() },
                    event.index().toNiceString(this.props.timeFormat)
                ));
            } else {
                var ts = (0, _moment2.default)(event.timestamp());
                cells.push(_react2.default.createElement(
                    "td",
                    { key: ts.valueOf() },
                    ts.format(this.props.timeFormat)
                ));
            }

            event.data().forEach(function (d, i) {
                var cell = void 0;
                if (_this.props.renderCell) {
                    cell = _this.props.renderCell(event, i);
                }

                if (cell) {
                    cells.push(_react2.default.createElement(
                        "td",
                        { key: i },
                        cell
                    ));
                } else {
                    cells.push(_react2.default.createElement(
                        "td",
                        { key: i },
                        d.toString()
                    ));
                }
            });
        }

        return cells;
    },
    renderRows: function renderRows() {
        var rows = [];
        var i = 0;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = this.props.series.events()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var event = _step.value;

                rows.push(_react2.default.createElement(
                    "tr",
                    { key: i },
                    this.renderCells(event)
                ));
                i++;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        var summaryStyle = {
            backgroundColor: "#ECECEC",
            borderTop: "#E0E0E0",
            borderTopWidth: 1,
            borderTopStyle: "solid"
        };

        if (this.props.summary) {
            var cells = _underscore2.default.map(this.props.summary, function (value, key) {
                return _react2.default.createElement(
                    "td",
                    { key: key },
                    _react2.default.createElement(
                        "b",
                        null,
                        value
                    )
                );
            });
            rows.push(_react2.default.createElement(
                "tr",
                { key: "summary", style: summaryStyle },
                cells
            ));
        }

        return rows;
    },
    renderHeader: function renderHeader() {
        var headerCells = [];
        var headerStyle = { borderTop: "none" };
        if (this.props.columns) {
            _underscore2.default.each(this.props.columns, function (column) {
                headerCells.push(_react2.default.createElement(
                    "th",
                    { key: column.label,
                        style: headerStyle },
                    column.label
                ));
            });
        } else {
            headerCells.push(_react2.default.createElement(
                "th",
                { key: "time" },
                "time"
            ));
            this.props.series._columns.forEach(function (column) {
                headerCells.push(_react2.default.createElement(
                    "th",
                    { key: column.label, style: headerStyle },
                    column
                ));
            });
        }

        return _react2.default.createElement(
            "tr",
            { key: "header" },
            headerCells
        );
    },
    render: function render() {
        var style = { marginBottom: 0 };

        return _react2.default.createElement(
            "table",
            { className: "table table-condensed table-striped",
                width: this.props.width,
                style: style },
            _react2.default.createElement(
                "tbody",
                null,
                this.renderHeader(),
                this.renderRows()
            )
        );
    }
}); /**
     *  Copyright (c) 2015, The Regents of the University of California,
     *  through Lawrence Berkeley National Laboratory (subject to receipt
     *  of any required approvals from the U.S. Dept. of Energy).
     *  All rights reserved.
     *
     *  This source code is licensed under the BSD-style license found in the
     *  LICENSE file in the root directory of this source tree.
     */