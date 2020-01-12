import React, {Component} from 'react';

class YoutubeFeed extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.posts.length > 0 && this.props.comments.length > 0){
            return (
                <div className="col-xl-4 col-md-12">
                    <div className="ms-panel ms-panel-fh">
                        <div className="ms-panel-header">
                            <h6>Youtube Feed</h6>
                        </div>
                        <div className="ms-panel-body p-0">
                            <ul className="ms-list ms-feed ms-twitter-feed">
                                <li className="ms-list-item">
                                    <div className="media clearfix">
                                        <img src="https://via.placeholder.com/270x270" className="ms-img-round ms-img-small"
                                             alt="people"/>
                                        <div className="media-body">
                                            <h4 className="ms-feed-user">Rakhan Potik</h4> <p>@rakhan45</p>
                                            <p>
                                                <a href="#" className="btn-link">@zurak</a> Thanks for sharing this
                                                awesome article with us, it is truly inspiring and an eye opener
                                            </p>
                                            <p>
                                                <a href="#" className="btn-link">#design</a>
                                                <a href="#" className="btn-link">#article</a>
                                                <a href="#" className="btn-link">#interface</a>
                                            </p>

                                        </div>
                                    </div>
                                </li>
                                <li className="ms-list-item">
                                    <div className="media clearfix">
                                        <img src="https://via.placeholder.com/270x270" className="ms-img-round ms-img-small"
                                             alt="people"/>
                                        <div className="media-body">
                                            <h4 className="ms-feed-user">Rakhan Potik</h4> <p>@rakhan45</p>
                                            <p>
                                                <a href="#" className="btn-link">@zurak</a> Thanks for sharing this
                                                awesome article with us, it is truly inspiring and an eye opener
                                            </p>
                                            <p>
                                                <a href="#" className="btn-link">#design</a>
                                                <a href="#" className="btn-link">#article</a>
                                                <a href="#" className="btn-link">#interface</a>
                                            </p>
                                        </div>
                                    </div>
                                </li>
                                <li className="ms-list-item">
                                    <div className="media clearfix">
                                        <img src="https://via.placeholder.com/270x270" className="ms-img-round ms-img-small"
                                             alt="people"/>
                                        <div className="media-body">
                                            <h4 className="ms-feed-user">Rakhan Potik</h4> <p>@rakhan45</p>
                                            <p>
                                                <a href="#" className="btn-link">@zurak</a> Thanks for sharing this
                                                awesome article with us, it is truly inspiring and an eye opener
                                            </p>
                                            <p>
                                                <a href="#" className="btn-link">#design</a>
                                                <a href="#" className="btn-link">#article</a>
                                                <a href="#" className="btn-link">#interface</a>
                                            </p>
                                        </div>
                                    </div>
                                </li>
                                <li className="ms-list-item">
                                    <div className="media clearfix">
                                        <img src="https://via.placeholder.com/270x270" className="ms-img-round ms-img-small"
                                             alt="people"/>
                                        <div className="media-body">
                                            <h4 className="ms-feed-user">Rakhan Potik</h4> <p>@rakhan45</p>
                                            <p>
                                                <a href="#" className="btn-link">@zurak</a> Thanks for sharing this
                                                awesome article with us, it is truly inspiring and an eye opener
                                            </p>
                                            <p>
                                                <a href="#" className="btn-link">#design</a>
                                                <a href="#" className="btn-link">#article</a>
                                                <a href="#" className="btn-link">#interface</a>
                                            </p>
                                        </div>
                                    </div>
                                </li>
                                <li className="ms-list-item">
                                    <div className="media clearfix">
                                        <img src="https://via.placeholder.com/270x270" className="ms-img-round ms-img-small"
                                             alt="people"/>
                                        <div className="media-body">
                                            <h4 className="ms-feed-user">Rakhan Potik</h4> <p>@rakhan45</p>
                                            <p>
                                                <a href="#" className="btn-link">@zurak</a> Thanks for sharing this
                                                awesome article with us, it is truly inspiring and an eye opener
                                            </p>
                                            <p>
                                                <a href="#" className="btn-link">#design</a>
                                                <a href="#" className="btn-link">#article</a>
                                                <a href="#" className="btn-link">#interface</a>
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="col-xl-4 col-md-12">
                    <div className="ms-panel ms-panel-fh">
                        <div className="ms-panel-header">
                            <h6>Youtube Feed</h6>
                        </div>
                        <div className="ms-panel-body p-0">
                            <h4>Coming soon</h4>
                        </div>
                    </div>
                </div>
            )
        }

    }

}

export default YoutubeFeed