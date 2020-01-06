import React, {Component} from 'react';
import Metric from "../MainDashboard/Metric";
import FacebookGraph from "../MainDashboard/Chart/FacebookGraph";
import FacebookFeed from "../MainDashboard/Feed/FacebookFeed";
import YoutubeFeed from "../MainDashboard/Feed/YoutubeFeed";
import InstagramFeed from "../MainDashboard/Feed/InstagramFeed";


class Overview extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="row">
                <Metric/>
                <FacebookGraph/>
                <FacebookFeed/>
                <InstagramFeed/>
                <YoutubeFeed/>
            </div>
        )
    }

}
export default Overview