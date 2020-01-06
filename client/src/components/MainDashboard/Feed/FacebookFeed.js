/**
 * Created by markvu129 on 6/1/20 on
 * Includes module purpose here
 */

import React, {Component} from 'react';

class FacebookFeed extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="col-xl-4 col-md-12">
                <div className="ms-panel ms-panel-fh">
                    <div className="ms-panel-header">
                        <h6>Facebook Feed</h6>
                    </div>
                    <div className="ms-panel-body p-0">
                        <ul className="ms-list ms-feed ms-facebook-feed">
                            <li className="ms-list-item">
                                <div className="media clearfix">
                                    <img src="https://via.placeholder.com/270x270" className="ms-img-round ms-img-small"
                                         alt="people"/>
                                    <div className="media-body">
                                        <h4 className="ms-feed-user">Rakhan Potik</h4>
                                        <p>24 January at 9:04 pm</p>
                                    </div>
                                </div>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                                <img className="ms-fb-feed-img" src="https://via.placeholder.com/530x240" alt="post"/>
                                <div className="d-flex justify-content-between">
                                    <div className="ms-fb-post-meta">
                                        <i className="material-icons">thumb_up</i> <span>485 likes</span>
                                    </div>
                                    <div className="ms-fb-post-meta">
                                        <span>48 comments</span>
                                    </div>
                                </div>

                            </li>
                            <li className="ms-list-item">
                                <div className="media clearfix">
                                    <img src="https://via.placeholder.com/270x270" className="ms-img-round ms-img-small"
                                         alt="people"/>
                                    <div className="media-body">
                                        <h4 className="ms-feed-user">Rakhan Potik</h4>
                                        <p>24 January at 9:04 pm</p>
                                    </div>
                                </div>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                                <img className="ms-fb-feed-img" src="https://via.placeholder.com/530x240" alt="post"/>
                                <div className="d-flex justify-content-between">
                                    <div className="ms-fb-post-meta">
                                        <i className="material-icons">thumb_up</i> <span>485 likes</span>
                                    </div>
                                    <div className="ms-fb-post-meta">
                                        <span>48 comments</span>
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

export default FacebookFeed;