import React, {Component} from 'react';
import Metric from "../MainDashboard/Metric";
import FacebookInsight from "./Chart/FacebookInsight";
import FacebookFeed from "../MainDashboard/Feed/FacebookFeed";
import YoutubeFeed from "../MainDashboard/Feed/YoutubeFeed";
import InstagramFeed from "../MainDashboard/Feed/InstagramFeed";
import axios from "axios";


class Overview extends Component {

    constructor(props) {
        super(props);
        this.state = {
            topFbPosts: [],
            topIgPosts: [],
            topFbComments: [],
            topIgComments: []
        };
        this.fetchTopFbPostsAndComments = this.fetchTopFbPostsAndComments.bind(this);
        this.fetchTopIgPostsAndComments = this.fetchTopIgPostsAndComments.bind(this);
    }

    fetchTopFbPostsAndComments() {
        let uri = "https://nasinsightserver.herokuapp.com/api/info/posts/nasDailyFB/post_impressions,post_reactions_like_total,post_video_views";

        axios.get(uri)
            .then(response => {
                this.setState({
                    topFbPosts: response.data.stats.stats
                });
                let topFbComments = [];
                response.data.stats.stats.forEach(
                    post => {
                        let comment_uri = "https://nasinsightserver.herokuapp.com/api/info/comments/nasDailyFB/" + post.id + '/5';
                        axios.get(comment_uri)
                            .then(comment_response => {
                                topFbComments.push({
                                    'id': post.id,
                                    comments: comment_response.data.comments
                                })

                            })
                    }
                );
                this.setState({
                    topFbComments: topFbComments
                })
            })
            .catch(err => console.log(err))
    }

    fetchTopIgPostsAndComments() {
        let uri = "https://nasinsightserver.herokuapp.com/api/info/posts/nasDailyIG/media_type,comments_count,like_count";

        axios.get(uri)
            .then(response => {
                this.setState({
                    topIgPosts: response.data.stats.stats
                });

                let topIgComments = [];
                response.data.stats.stats.forEach(
                    post => {
                        let comment_uri = "https://nasinsightserver.herokuapp.com/api/info/comments/nasDailyFB/" + post.id + '/5';
                        axios.get(comment_uri)
                            .then(comment_response => {
                                topIgComments.push({
                                    'id': post.id,
                                    comments: comment_response.data.comments
                                })
                            })
                    }
                );
                this.setState({
                    topIgComments: topIgComments
                })
            })
            .catch(err => console.log(err))
    }

    componentDidMount() {
        // this.fetchTopFbPostsAndComments();
        // this.fetchTopIgPostsAndComments();
    }


    render() {
        return (
            <div className="row">
                <Metric/>
                <FacebookInsight/>
                {/*<FacebookFeed label="facebook feed" posts={this.state.topFbPosts}*/}
                {/*                  comments={this.state.topFbComments}/>*/}
            </div>
        )
    }

}

export default Overview