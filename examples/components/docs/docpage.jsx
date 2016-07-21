/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

/* eslint max-len:0 */

import React from "react";
import Highlighter from "../util/highlighter";
import APIDocs from "./apidocs";

export default React.createClass({

    mixins: [Highlighter],

    render() {
        const component = this.props.params.component;
        const path = `src/${component}.jsx`;
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <APIDocs file={path}/>
                    </div>
                </div>
            </div>
        );
    }
});
