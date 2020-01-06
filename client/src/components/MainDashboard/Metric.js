import React, {Component} from 'react';

class Metric extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="col-xl-4 col-md-12">
                <div className="ms-panel ms-panel-fh">
                    <div className="ms-panel-header company-title-div">
                        <h6 id="company-title">The<span className="nas"> NAS </span>Company<span
                            className="nas">.</span></h6>
                    </div>
                    <div className="ms-panel-body p-0">
                        <div className="ms-social-media-followers">
                            <div className="ms-social-grid">
                                <i className="fa fa-facebook-f bg-facebook"></i>
                                <p className="ms-text-dark">14,000,000</p>
                                <span>Followers</span>
                                <p className="ms-text-dark">8,039</p>
                                <span>Likes</span>
                            </div>
                            <div className="ms-social-grid">
                                <i className="fa fa-instagram bg-instagram"></i>
                                <p className="ms-text-dark">98,039</p>
                                <span>Followers</span>
                                <p className="ms-text-dark">6,000</p>
                                <span>Likes</span>
                            </div>
                        </div>
                        <div className="ms-social-media-followers">
                            <div className="youtube-div">
                                <i className="fa fa-youtube-play bg-youtube"></i>
                                <p className="ms-text-dark">8,039</p>
                                <span>Subscribers</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default Metric