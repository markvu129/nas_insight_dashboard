import React, {Component} from 'react';
import './css/TopVideos.css';
import axios from "axios";
import Select from "react-select";

class TopVideos extends Component {

    constructor(props) {
        super(props);
        this.state = {
            source: "nasDailyFB",
            recentVideos: []
        };
        this.fetchVideos = this.fetchVideos.bind(this);
        this.renderVideos = this.renderVideos.bind(this);
        this.onSelectMetrics = this.onSelectMetrics.bind(this);
    }

    fetchVideos(value) {
        let uri = "https://nasinsightserver.herokuapp.com/api/videos/" + value + "/latest";
        axios.get(uri)
            .then(response => {
                console.log(response)
                this.setState({
                    recentVideos: response.data
                });
            })
    }

    componentDidMount() {
        this.fetchVideos(this.state.source);
    }

    shouldComponentUpdate(nextProps, nextState, nextContent) {
        return this.state.recentVideos !== nextState.recentVideos
    }

    onSelectMetrics(value) {
        this.fetchVideos(value.value);
        this.setState({
            source: value.value
        });
    }

    renderVideos(videos) {
      const listOfVideos = videos.map((video) =>
          <tr key={video.id}>
              <td data-column="Video">
                  <img className="video-widget-img" src={video.picture}></img>
                  <br/>
                  <p className="video-widget-title">{video.title}</p>
              </td>
              <td data-column="Total views">
                  <p className="video-widget-metric">{video.data.filter(x => x.name === 'total_video_views')[0].values[0].value.toLocaleString()}</p>
                  <p className="video-widget-annotation">Views</p>
              </td>
              <td data-column="Total impressions">
                  <p className="video-widget-metric">{video.data.filter(x => x.name === 'total_video_impressions')[0].values[0].value.toLocaleString()}</p>
                  <p className="video-widget-annotation">Impressions</p>
              </td>
              <td data-column="Engagement">
                  <div className="video-widget-reactions">
                      <p className="video-widget-metric">{video.data.filter(x => x.name === 'total_video_stories_by_action_type')[0].values[0].value['share'].toLocaleString()}</p>
                      <p className="video-widget-annotation">Share</p>
                  </div>
                  <div className="video-widget-reactions">
                      <p className="video-widget-metric">{video.data.filter(x => x.name === 'total_video_stories_by_action_type')[0].values[0].value['like'].toLocaleString()}</p>
                      <p className="video-widget-annotation">Like</p>
                  </div>
                  <div className="video-widget-reactions">
                      <p className="video-widget-metric">{video.data.filter(x => x.name === 'total_video_stories_by_action_type')[0].values[0].value['comment'].toLocaleString()}</p>
                      <p className="video-widget-annotation">Comments</p>
                  </div>
              </td>
          </tr>
      );
        return (
            <tbody>
                {listOfVideos}
            </tbody>
        )
    }

    render() {
        if (this.state.recentVideos.length > 0){

            let sourceOptions = [{"label": "NasDaily", "value": "nasDailyFB"},
                {"label": "NasDaily VN", "value": "nasDailyFBVN"},
                {"label": "NasDaily SP", "value": "nasDailyFBSP"},
                {"label": "NasDaily CN", "value": "nasDailyFBCH"},
                {"label": "NasDaily PH", "value": "nasDailyFBPH"},
                {"label": "NasDaily ARB", "value": "nasDailyFBARB"},
                {"label": "NasDaily TH", "value": "nasDailyFBTH"}
            ]
            return (
                <div>
                    <table>
                        <thead>
                        <tr>
                            <th className="video-column">
                                <p className="video-column-title">Video</p>
                                <p>
                                    <Select className="select-video-source"
                                            placeholder={this.state.source ? this.state.source : "Select source"}
                                            options={sourceOptions}
                                            onChange={(value) => this.onSelectMetrics(value)}/>
                                </p>
                            </th>
                            <th>Total views</th>
                            <th>Total impressions</th>
                            <th>Engagement</th>
                        </tr>
                        </thead>
                        {this.renderVideos(this.state.recentVideos)}
                    </table>
                </div>
            );
        }
        else {
            return (
                <div></div>
            )
        }

    }
}

export default TopVideos;