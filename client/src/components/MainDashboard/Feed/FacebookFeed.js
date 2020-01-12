/**
 * Created by markvu129 on 6/1/20 on
 * Includes module purpose here
 */

import React, {Component} from 'react';

class FacebookFeed extends Component {

    constructor(props) {
        super(props);
        this.renderTopPosts = this.renderTopPosts.bind(this);
    }

    renderTopPosts() {
        if (this.props.posts.length > 0) {
            return this.props.posts.map((post, index) => {
                return (
                    <li className="ms-list-item" key={post.id}>
                        <div className="media clearfix">
                            <div className="media-body">
                                <h4 className="ms-feed-user">{post.id}</h4>
                            </div>
                        </div>
                        <ul className="ms-group-members clearfix">
                            <li><img src="https://via.placeholder.com/270x270" alt="member"/></li>
                            <li><img src="https://via.placeholder.com/270x270" alt="member"/></li>
                            <li className="ms-group-count">
                                <p>{post.insights.data.filter(x => x.name === 'post_reactions_like_total')[0].values[0].value.toLocaleString()} likes
                                </p></li>
                        </ul>


                    </li>
                )
            });

        }
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="col-xl-4 col-md-12">
                <div className="ms-panel ms-panel-fh">
                    <div className="ms-panel-header">
                        <h6>{this.props.label}</h6>
                    </div>
                    <div className="ms-panel-body p-0">
                        <ul className="ms-list ms-feed ms-facebook-feed">
                            {this.renderTopPosts()}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }

}

export default FacebookFeed;