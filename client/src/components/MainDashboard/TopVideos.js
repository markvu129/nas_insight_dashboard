import React, {Component} from 'react';
import './css/TopVideos.css';
import axios from "axios";
import Select from "react-select";
import Modal from "react-bootstrap/Modal";
import FacebookPlayer from "react-facebook-player";
import './css/Metric.css';

class TopVideos extends Component {

    constructor(props) {
        super(props);
        this.state = {
            source: "nasDailyFB",
            recentVideos: [],
            currentVideo: {},
            modalIsOpen: false
        };
        this.fetchVideos = this.fetchVideos.bind(this);
        this.renderVideos = this.renderVideos.bind(this);
        this.onSelectMetrics = this.onSelectMetrics.bind(this);
        this.setCurrentVideo = this.setCurrentVideo.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onPlayerReady = this.onPlayerReady.bind(this);
    }

    fetchVideos(value) {
        let uri = "https://nasinsightserver.herokuapp.com/api/videos/" + value + "/latest";
        axios.get(uri)
            .then(response => {
                this.setState({
                    recentVideos: response.data,
                    currentVideo: response.data[0]
                });
            })
    }

    componentDidMount() {
        this.fetchVideos(this.state.source);
    }

    shouldComponentUpdate(nextProps, nextState, nextContent) {
        return this.state.recentVideos !== nextState.recentVideos || this.state.currentVideo !== nextState.currentVideo || this.state.modalIsOpen !== nextState.modalIsOpen
    }

    onSelectMetrics(value) {
        this.fetchVideos(value.value);
        this.setState({
            source: value.value
        });
    }

    setCurrentVideo(id){
        const videos = this.state.recentVideos;
        this.setState({
            currentVideo: videos.filter(v => v.id === id)[0],
            modalIsOpen: true
        })
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        })
    }

    onPlayerReady(_id, player) {
        player.unmute();
        player.play();
    }


    renderVideos(videos) {
      const listOfVideos = videos.map((video) =>
          <tr key={video.id}>
              <td data-column="Video">
                  <img className="video-widget-img" src={video.picture} onClick={() => this.setCurrentVideo(video.id)}></img>
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
                  {this.state.source !== 'nasDailyFBCH' ? (
                      <div className="video-widget-reactions">
                          <p className="video-widget-metric">{video.data.filter(x => x.name === 'total_video_stories_by_action_type')[0].values[0].value['share'].toLocaleString()}</p>
                          <p className="video-widget-annotation">Shares</p>
                      </div>) : (<div></div>)
                  }
                  <div className="video-widget-reactions">
                      <p className="video-widget-metric">{video.data.filter(x => x.name === 'total_video_stories_by_action_type')[0].values[0].value['like'].toLocaleString()}</p>
                      <p className="video-widget-annotation">Likes</p>
                  </div>
                  { this.state.source !== 'nasDailyFBCH' ? (
                  <div className="video-widget-reactions">
                      <p className="video-widget-metric">{video.data.filter(x => x.name === 'total_video_stories_by_action_type')[0].values[0].value['comment'].toLocaleString()}</p>
                      <p className="video-widget-annotation">Comments</p>
                  </div>) : (<div></div>)}
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
                    <Select className="select-video-source-mobile"
                    placeholder={this.state.source ? "Video source: " + this.state.source : "Select source"}
                    options={sourceOptions}
                    onChange={(value) => this.onSelectMetrics(value)}/>
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
                    {
                        this.state.currentVideo ? (<Modal id='stats' show={this.state.modalIsOpen} onHide={this.closeModal} animation={false}>
                            <Modal.Body>
                                <h2 className="daily-detail-title" style={{ 'color': '#e8c552'}}>{this.state.currentVideo.title}</h2>
                                <FacebookPlayer
                                    width={200}
                                    height={100}
                                    appId={880756785680649}
                                    videoId={this.state.currentVideo.id}
                                    id={`video-id-${this.state.currentVideo.id}`}
                                    onReady={this.onPlayerReady}
                                />
                                <div className="ms-panel-body p-0">
                                    <div className="ms-social-media-followers">
                                        <div className="ms-social-grid">
                                            <div className="section-icon"><i className="fa fa-tv"></i></div>
                                            <p className="ms-text-dark">{this.state.currentVideo.data.filter(x => x.name === 'total_video_views_unique')[0].values[0].value.toLocaleString()}</p>
                                            <span>Total Views unique</span>

                                        </div>
                                        <div className="ms-social-grid">
                                            <div className="section-icon"><i className="fa fa-volume-up"></i></div>
                                            <p className="ms-text-dark">{this.state.currentVideo.data.filter(x => x.name === 'total_video_views_sound_on')[0].values[0].value.toLocaleString()}</p>
                                            <span>Views sound on</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="ms-panel-body p-0">
                                    <div className="ms-social-media-followers">
                                        <div className="ms-social-grid">
                                            <div className="section-icon"><i className="fa fa-history"></i></div>
                                            <p className="ms-text-dark">{this.state.currentVideo.data.filter(x => x.name === 'total_video_views_unique')[0].values[0].value.toLocaleString()}</p>
                                            <span>Video view complete <br/>(95% length)</span>
                                        </div>
                                        <div className="ms-social-grid">
                                            <div className="section-icon"><i className="fa fa-user"></i></div>
                                            <p className="ms-text-dark">{this.state.currentVideo.data.filter(x => x.name === 'total_video_impressions_unique')[0].values[0].value.toLocaleString()}</p>
                                            <span>Impressions unique</span>
                                        </div>
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal>) : (<div></div>)
                    }

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