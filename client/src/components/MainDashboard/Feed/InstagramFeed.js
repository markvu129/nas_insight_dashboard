import React, {Component} from 'react';

class InstagramFeed extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div class="col-xl-4 col-md-12">
                <div class="ms-panel ms-panel-fh">
                    <div class="ms-panel-header">
                        <h6>{this.props.label}</h6>
                    </div>
                    <div class="ms-panel-body p-0">
                        <ul class="ms-list ms-feed ms-instagram-feed">
                            <li class="ms-list-item">
                                <div class="media clearfix">
                                    <div class="media-body">
                                        <h4 class="ms-feed-user">username24</h4>
                                    </div>
                                </div>
                                <ul class="ms-group-members clearfix">
                                    <li><img src="https://via.placeholder.com/270x270" alt="member"/></li>
                                    <li><img src="https://via.placeholder.com/270x270" alt="member"/></li>
                                    <li class="ms-group-count"><p>48 likes</p></li>
                                </ul>
                                <p><span class="ms-text-dark medium">username24</span> website design in progress </p>
                                <p><a href="#" class="btn-link">#design</a> <a href="#" class="btn-link">#ui</a> <a
                                    href="#" class="btn-link">#ux</a> <a href="#" class="btn-link">#website</a></p>
                            </li>
                            <li class="ms-list-item">
                                <div class="media clearfix">
                                    <img src="https://via.placeholder.com/270x270" class="ms-img-round ms-img-small"
                                         alt="people"/>
                                    <div class="media-body">
                                        <h4 class="ms-feed-user">username24</h4>
                                    </div>
                                </div>
                                <img class="ms-fb-feed-img" src="https://via.placeholder.com/530x240" alt="post"/>
                                <div class="d-flex justify-content-between">
                                    <div class="ms-feed-controls">
                                        <i class="material-icons">favorite_border</i>
                                        <i class="material-icons">chat_bubble_outline</i>
                                    </div>
                                </div>
                                <ul class="ms-group-members clearfix">
                                    <li><img src="https://via.placeholder.com/270x270" alt="member"/></li>
                                    <li><img src="https://via.placeholder.com/270x270" alt="member"/></li>
                                    <li class="ms-group-count"><p>Liked By <span
                                        class="ms-text-dark medium">user5</span> and <span class="ms-text-dark medium">37 others</span>
                                    </p></li>
                                </ul>
                                <p><span class="ms-text-dark medium">username24</span> website design in progress </p>
                                <p><a href="#" class="btn-link">#design</a> <a href="#" class="btn-link">#ui</a> <a
                                    href="#" class="btn-link">#ux</a> <a href="#" class="btn-link">#website</a></p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }

}

export default InstagramFeed;