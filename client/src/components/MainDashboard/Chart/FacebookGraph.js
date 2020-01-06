import React, {Component} from 'react';

class FacebookGraph extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="col-xl-5 col-md-12">
                <div className="ms-panel ms-panel-fh ms-facebook-engagements">
                    <div className="ms-panel-header">
                        <h6>Facebook Engagements and Impressions</h6>
                    </div>
                    <div className="ms-panel-body p-0">
                        <ul className="ms-list clearfix">
                            <li className="ms-list-item">
                                <div className="d-flex justify-content-between align-items-end">
                                    <div className="ms-graph-meta">
                                        <h2>User Engagement</h2>
                                        <p className="ms-text-dark">45.07%</p>
                                        <p className="ms-text-success">+28.44%</p>
                                        <p>VS 66.68% (Prev)</p>
                                    </div>
                                    <div className="ms-graph-canvas">
                                        <canvas id="engaged-users"></canvas>
                                    </div>
                                </div>
                            </li>
                            <li className="ms-list-item">
                                <div className="d-flex justify-content-between align-items-end">
                                    <div className="ms-graph-meta">
                                        <h2>Page Impressions</h2>
                                        <p className="ms-text-dark">45.07%</p>
                                        <p className="ms-text-success">+28.44%</p>
                                        <p>VS 66.68% (Prev)</p>
                                    </div>
                                    <div className="ms-graph-canvas">
                                        <canvas id="page-impressions"></canvas>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }

}

export default FacebookGraph