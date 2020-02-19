import React, {Component} from 'react';
import './css/TopVideos.css';
import axios from "axios";
import Select from "react-select";
import Modal from "react-bootstrap/Modal";
import FacebookPlayer from "react-facebook-player";
import './css/Metric.css';
import './css/VideoDetail.css';
import {Bar, Pie} from "react-chartjs-2";

class TopVideos extends Component {

    constructor(props) {
        super(props);
        this.state = {
            source: "nasDailyFB",
            recentVideos: [],
            currentVideo: {},
            modalIsOpen: false,
            commentModalIsOpen: false,
            viewModalIsOpen: false,
            impressionModalIsOpen: false
        };
        this.fetchVideos = this.fetchVideos.bind(this);
        this.renderVideos = this.renderVideos.bind(this);
        this.onSelectMetrics = this.onSelectMetrics.bind(this);
        this.setCurrentVideo = this.setCurrentVideo.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onPlayerReady = this.onPlayerReady.bind(this);
        this.setCurrentComments = this.setCurrentComments.bind(this);
        this.setCurrentViews = this.setCurrentViews.bind(this);
        this.setImpressionViews = this.setImpressionViews.bind(this)
    }

    fetchVideos(value) {
        let uri = "https://nasinsightserver.herokuapp.com/api/videos/all/" + value + "/5/1";
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
        return this.state.recentVideos !== nextState.recentVideos
            || this.state.currentVideo !== nextState.currentVideo
            || this.state.modalIsOpen !== nextState.modalIsOpen
            || this.state.commentModalIsOpen !== nextState.commentModalIsOpen
            || this.state.viewModalIsOpen !== nextState.viewModalIsOpen
            || this.state.impressionModalIsOpen !== nextState.impressionModalIsOpen
    }

    onSelectMetrics(value) {
        this.fetchVideos(value.value);
        this.setState({
            source: value.value
        });
    }

    setCurrentVideo(id) {
        const videos = this.state.recentVideos;
        this.setState({
            currentVideo: videos.filter(v => v.id === id)[0],
            modalIsOpen: true
        })
    }

    setCurrentComments(id) {
        const videos = this.state.recentVideos;
        this.setState({
            currentVideo: videos.filter(v => v.id === id)[0],
            commentModalIsOpen: true
        })
    }

    setCurrentViews(id) {
        const videos = this.state.recentVideos;
        this.setState({
            currentVideo: videos.filter(v => v.id === id)[0],
            viewModalIsOpen: true
        })
    }

    setImpressionViews(id) {
        const videos = this.state.recentVideos;
        this.setState({
            currentVideo: videos.filter(v => v.id === id)[0],
            impressionModalIsOpen: true
        })
    }

    closeModal() {
        this.setState({
            modalIsOpen: false,
            commentModalIsOpen: false,
            viewModalIsOpen: false,
            impressionModalIsOpen: false
        })
    }

    onPlayerReady(_id, player) {
        player.unmute();
        player.play();
    }


    renderVideos(videos) {
        if (videos.length > 0) {
            const listOfVideos = videos.map((video) =>
                <tr key={video.id}>
                    <td data-column="Video">
                        <img className="video-widget-img" src={video.picture}
                             onClick={() => this.setCurrentVideo(video.id)}></img>
                        <br/>
                        <p className="video-widget-title">{video.title}</p>
                        <p className="">Last updated at: {video.updatedAt}</p>
                    </td>
                    <td data-column="Total views">
                        <p className="video-widget-metric">{video.dailyStats.filter(x => x.name === 'total_video_views')[0].values[0].value.toLocaleString()}</p>
                        <p className="video-widget-annotation">Views</p>
                        <p className="comment-button" onClick={() => this.setCurrentViews(video.id)}>See retention </p>
                    </td>
                    <td data-column="Total impressions">
                        <p className="video-widget-metric">{video.dailyStats.filter(x => x.name === 'total_video_impressions')[0].values[0].value.toLocaleString()}</p>
                        <p className="video-widget-annotation">Impressions</p>
                        <p className="comment-button" onClick={() => this.setImpressionViews(video.id)}>See reach </p>
                    </td>
                    <td data-column="Engagement">
                        {video.dailyStats.filter(x => x.name === 'total_video_stories_by_action_type')[0].values[0].value['share'] ? (
                            <div className="video-widget-reactions">
                                <p className="video-widget-metric">{video.dailyStats.filter(x => x.name === 'total_video_stories_by_action_type')[0].values[0].value['share'].toLocaleString()}</p>
                                <p className="video-widget-annotation">Shares</p>
                            </div>) : (<div></div>)
                        }
                        <div className="video-widget-reactions">
                            <p className="video-widget-metric">{video.dailyStats.filter(x => x.name === 'total_video_stories_by_action_type')[0].values[0].value['like'].toLocaleString()}</p>
                            <p className="video-widget-annotation">Likes</p>
                        </div>
                        {video.dailyStats.filter(x => x.name === 'total_video_stories_by_action_type')[0].values[0].value['comment'] ? (
                            <div className="video-widget-reactions">
                                <p className="video-widget-metric">{video.dailyStats.filter(x => x.name === 'total_video_stories_by_action_type')[0].values[0].value['comment'].toLocaleString()}</p>
                                <p className="video-widget-annotation">Comments</p>
                                {video.topComments.length > 0 ? (
                                    <p className="comment-button" onClick={() => this.setCurrentComments(video.id)}>See
                                        comments </p>) : (<p></p>)}
                            </div>) : (<div></div>)}
                    </td>
                </tr>
            );
            return (
                <tbody>
                {listOfVideos}
                </tbody>
            )
        } else {
            return (
                <tbody/>
            )
        }

    }

    renderComments(comments) {
        const listOfComments = comments.map(comment =>
            <div className="comment-div">
                <p className="comment-msg"> {comment.message}</p>
                <p className="comment-time">{new Date(comment.created_time).toLocaleString()}</p>
            </div>
        );

        return listOfComments;
    }

    render() {
        if (this.state.recentVideos.length > 0) {

            let sourceOptions = [{"label": "NasDaily", "value": "nasDailyFB"},
                {"label": "NasDaily VN", "value": "nasDailyFBVN"},
                {"label": "NasDaily SP", "value": "nasDailyFBSP"},
                {"label": "NasDaily CN", "value": "nasDailyFBCH"},
                {"label": "NasDaily PH", "value": "nasDailyFBPH"},
                {"label": "NasDaily ARB", "value": "nasDailyFBARB"},
                {"label": "NasDaily TH", "value": "nasDailyFBTH"}
            ];

            const plugins = [{
                afterDraw: (chartInstance, easing) => {
                    const ctx = chartInstance.chart.ctx;
                }
            }];


            let viewGraphData = {
                labels: ['Complete views', '30 secs view', '10 secs view'],
                datasets: [
                    {
                        label: 'View Retention',
                        backgroundColor: ['rgba(255,99,132,1)', '#298ae9', '#3b7464'],
                        borderColor: ['rgba(255,99,132,1)', '#298ae9', '#3b7464'],
                        borderWidth: 1,
                        hoverBackgroundColor: ['rgba(255,99,132,1)', '#298ae9', '#3b7464'],
                        hoverBorderColor: ['rgba(255,99,132,1)', '#298ae9', '#3b7464'],
                        data: [this.state.currentVideo.dailyStats.filter(x => x.name === 'total_video_complete_views')[0].values[0].value,
                            this.state.currentVideo.dailyStats.filter(x => x.name === 'total_video_30s_views')[0].values[0].value,
                            this.state.currentVideo.dailyStats.filter(x => x.name === 'total_video_10s_views')[0].values[0].value
                        ]
                    }
                ]

            };

            let viewByCountryData = this.state.currentVideo.dailyStats.filter(x => x.name === 'total_video_view_time_by_country_id')[0].values[0].value;
            let viewCountryData = Object.values(viewByCountryData).sort((a, b) => b - a);
            let viewCountryLabels = Object.keys(viewByCountryData).sort((a, b) => viewByCountryData[b] - viewByCountryData[a]);
            let topViewCountryData = viewCountryData.slice(0, 3);
            let otherViewCountryData = viewCountryData.slice(3, viewByCountryData.length).reduce((a, b) => a + b, 0);
            topViewCountryData.push(otherViewCountryData);
            ;
            let viewCountryGraphLabels = viewCountryLabels.slice(0, 3);
            viewCountryGraphLabels.push('Others');

            let listOfPieColors = ['rgba(255,99,132,1)', '#298ae9', '#3b7464', '#9f3db6'];

            let viewByCountryGraphData = {
                labels: viewCountryGraphLabels,
                datasets: [{
                    data: topViewCountryData,
                    backgroundColor: listOfPieColors,
                    hoverBackgroundColor: listOfPieColors
                }]
            }


            let graphOptions = {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    xAxes: [
                        {
                            gridLines: {
                                color: '#ffffff',
                                borderDash: [1, 3],
                            }
                        }

                    ],
                    yAxes: [
                        {
                            ticks: {
                                callback: function (label, index, labels) {
                                    return label.toLocaleString();
                                }
                            }

                        }
                    ]
                },
                legend: {
                    display: true,
                },
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem, data) {
                            return tooltipItem.yLabel.toLocaleString();
                        }
                    }
                }
            }

            return (
                <div>
                    <Select className="select-video-source-mobile"
                            placeholder={this.state.source ? "Video source: " + this.state.source : "Select source"}
                            options={sourceOptions}
                            onChange={(value) => this.onSelectMetrics(value)}/>
                    <table>
                        <thead className="video-table-head">
                        <tr>
                            <th className="video-column">
                                <p className="video-column-title">Video</p>
                                <p>
                                    <Select className="select-video-source"
                                            placeholder={this.state.source ? this.state.source : "Nas Daily"}
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
                        this.state.currentVideo ?
                            (<Modal id='views' show={this.state.impressionModalIsOpen} onHide={this.closeModal}
                                    animation={false}>
                                    <Modal.Body>
                                        <h2 className="daily-detail-title"
                                            style={{'color': '#0089e9'}}>{this.state.currentVideo.title}</h2>
                                        <div className="ms-panel-body p-0">
                                            <div className="ms-social-media-followers">
                                                <div className="ms-social-grid">
                                                    <div className="section-icon"><i className="fa fa-tv"></i></div>
                                                    <p className="ms-text-dark">{this.state.currentVideo.dailyStats.filter(x => x.name === 'total_video_impressions_unique')[0].values[0].value.toLocaleString()}</p>
                                                    <span>Total Impressions unique</span>

                                                </div>
                                                <div className="ms-social-grid">
                                                    <div className="section-icon"><i className="fa fa-users"></i></div>
                                                    <p className="ms-text-dark">{this.state.currentVideo.dailyStats.filter(x => x.name === 'total_video_impressions_viral')[0].values[0].value.toLocaleString()}</p>
                                                    <span>Total Impressions viral</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Modal.Body>
                                </Modal>
                            ) : (<div></div>)
                    }
                    {
                        this.state.currentVideo ?
                            (<Modal id='views' show={this.state.viewModalIsOpen} onHide={this.closeModal}
                                    animation={false}>
                                    <Modal.Body>
                                        <div className="ms-panel-body p-0">
                                            <h2 className="daily-detail-title"
                                                style={{'color': '#0089e9'}}>{this.state.currentVideo.title}</h2>
                                            <div className="ms-social-media-followers">
                                                <div className="ms-social-grid">
                                                    <div className="section-icon"><i className="fa fa-tv"></i></div>
                                                    <p className="ms-text-dark">{Math.round((this.state.currentVideo.dailyStats.filter(x => x.name === 'total_video_view_total_time')[0].values[0].value) / 60000).toLocaleString()}</p>
                                                    <span>Total View Time (Mins)</span>

                                                </div>
                                                <div className="ms-social-grid">
                                                    <div className="section-icon"><i className="fa fa-tv"></i>
                                                    </div>
                                                    <p className="ms-text-dark">{this.state.currentVideo.dailyStats.filter(x => x.name === 'total_video_avg_time_watched')[0].values[0].value.toLocaleString()}</p>
                                                    <span>Average time video viewed</span>
                                                </div>
                                            </div>
                                            <div className="ms-social-media-followers">
                                                <Bar data={viewGraphData}
                                                     width={100}
                                                     height={300}
                                                     options={graphOptions}
                                                     plugins={plugins}

                                                />
                                            </div>
                                            <p>Views by country</p>
                                            <div className="ms-social-media-followers">
                                                <Pie data={viewByCountryGraphData} options={{
                                                    tooltips: {
                                                        callbacks: {
                                                            label: function (tooltipItem, data) {
                                                                var dataset = data.datasets[tooltipItem.datasetIndex];
                                                                return dataset.data[tooltipItem.index].toLocaleString()
                                                            }
                                                        }
                                                    }
                                                }}/>

                                            </div>
                                        </div>
                                    </Modal.Body>
                                </Modal>
                            ) : (<div></div>)
                    }

                    {
                        this.state.currentVideo ? (
                            <Modal id='stats' show={this.state.modalIsOpen} onHide={this.closeModal} animation={false}>
                                <Modal.Body>
                                    <h2 className="daily-detail-title"
                                        style={{'color': '#0089e9'}}>{this.state.currentVideo.title}</h2>
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
                                                <p className="ms-text-dark">{this.state.currentVideo.dailyStats.filter(x => x.name === 'total_video_views_unique')[0].values[0].value.toLocaleString()}</p>
                                                <span>Total Views unique</span>

                                            </div>
                                            <div className="ms-social-grid">
                                                <div className="section-icon"><i className="fa fa-volume-up"></i></div>
                                                <p className="ms-text-dark">{this.state.currentVideo.dailyStats.filter(x => x.name === 'total_video_views_sound_on')[0].values[0].value.toLocaleString()}</p>
                                                <span>Views sound on</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ms-panel-body p-0">
                                        <div className="ms-social-media-followers">
                                            <div className="ms-social-grid">
                                                <div className="section-icon"><i className="fa fa-history"></i></div>
                                                <p className="ms-text-dark">{this.state.currentVideo.dailyStats.filter(x => x.name === 'total_video_views_unique')[0].values[0].value.toLocaleString()}</p>
                                                <span>Video view complete <br/>(95% length)</span>
                                            </div>
                                            <div className="ms-social-grid">
                                                <div className="section-icon"><i className="fa fa-user"></i></div>
                                                <p className="ms-text-dark">{this.state.currentVideo.dailyStats.filter(x => x.name === 'total_video_impressions_unique')[0].values[0].value.toLocaleString()}</p>
                                                <span>Impressions unique</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ms-panel-body p-0 ms-panel-emotion-div">
                                        {
                                            this.state.currentVideo.dailyStats.filter(x => x.name === 'total_video_reactions_by_type_total')[0].values[0].value['like'] ? (
                                                <div className="ms-social-media-emoticon-grid">
                                                    <div className="section-icon"><img
                                                        src="/assets/img/images/emoticons/like.svg"/></div>
                                                    <p className="ms-text-dark">{this.state.currentVideo.dailyStats.filter(x => x.name === 'total_video_reactions_by_type_total')[0].values[0].value['like'].toLocaleString()}</p>
                                                </div>
                                            ) : (<div></div>)
                                        }
                                        {
                                            this.state.currentVideo.dailyStats.filter(x => x.name === 'total_video_reactions_by_type_total')[0].values[0].value['love'] ? (
                                                <div className="ms-social-media-emoticon-grid">
                                                    <div className="section-icon"><img
                                                        src="/assets/img/images/emoticons/love.svg"/></div>
                                                    <p className="ms-text-dark">{this.state.currentVideo.dailyStats.filter(x => x.name === 'total_video_reactions_by_type_total')[0].values[0].value['love'].toLocaleString()}</p>
                                                </div>
                                            ) : (<div></div>)
                                        }
                                        {
                                            this.state.currentVideo.dailyStats.filter(x => x.name === 'total_video_reactions_by_type_total')[0].values[0].value['wow'] ? (
                                                <div className="ms-social-media-emoticon-grid">
                                                    <div className="section-icon"><img
                                                        src="/assets/img/images/emoticons/wow.svg"/></div>
                                                    <p className="ms-text-dark">{this.state.currentVideo.dailyStats.filter(x => x.name === 'total_video_reactions_by_type_total')[0].values[0].value['wow'].toLocaleString()}</p>
                                                </div>
                                            ) : (<div></div>)
                                        }
                                        {
                                            this.state.currentVideo.dailyStats.filter(x => x.name === 'total_video_reactions_by_type_total')[0].values[0].value['haha'] ? (
                                                <div className="ms-social-media-emoticon-grid">
                                                    <div className="section-icon"><img
                                                        src="/assets/img/images/emoticons/haha.svg"/></div>
                                                    <p className="ms-text-dark">{this.state.currentVideo.dailyStats.filter(x => x.name === 'total_video_reactions_by_type_total')[0].values[0].value['haha'].toLocaleString()}</p>
                                                </div>
                                            ) : (<div></div>)
                                        }
                                        {
                                            this.state.currentVideo.dailyStats.filter(x => x.name === 'total_video_reactions_by_type_total')[0].values[0].value['sorry'] ? (
                                                <div className="ms-social-media-emoticon-grid">
                                                    <div className="section-icon"><img
                                                        src="/assets/img/images/emoticons/sad.svg"/></div>
                                                    <p className="ms-text-dark">{this.state.currentVideo.dailyStats.filter(x => x.name === 'total_video_reactions_by_type_total')[0].values[0].value['sorry'].toLocaleString()}</p>
                                                </div>
                                            ) : (<div></div>)
                                        }
                                        {
                                            this.state.currentVideo.dailyStats.filter(x => x.name === 'total_video_reactions_by_type_total')[0].values[0].value['anger'] ? (
                                                <div className="ms-social-media-emoticon-grid">
                                                    <div className="section-icon"><img
                                                        src="/assets/img/images/emoticons/angry.svg"/></div>
                                                    <p className="ms-text-dark">{this.state.currentVideo.dailyStats.filter(x => x.name === 'total_video_reactions_by_type_total')[0].values[0].value['anger'].toLocaleString()}</p>
                                                </div>
                                            ) : (<div></div>)
                                        }
                                    </div>
                                </Modal.Body>
                            </Modal>) : (<div></div>)
                    }
                    {
                        this.state.currentVideo.topComments && this.state.currentVideo.topComments.length > 0 ? (
                            <Modal id='stats' show={this.state.commentModalIsOpen} onHide={this.closeModal}
                                   animation={false}>
                                <Modal.Body>
                                    <h2 className="daily-detail-title"
                                        style={{'color': '#0089e9'}}>{this.state.currentVideo.title}</h2>
                                    <FacebookPlayer
                                        width={200}
                                        height={100}
                                        appId={880756785680649}
                                        videoId={this.state.currentVideo.id}
                                        id={`video-id-${this.state.currentVideo.id}`}
                                        onReady={this.onPlayerReady}
                                    />
                                    <h2 className="comment-title"><i className="comment-icon fa fa-comments"></i>Comments
                                    </h2>
                                    <div>
                                        {this.renderComments(this.state.currentVideo.topComments.slice(0, 10))}
                                    </div>
                                </Modal.Body>
                            </Modal>
                        ) : (<div></div>)
                    }
                </div>
            );
        } else {
            return (
                <div></div>
            )
        }

    }
}

export default TopVideos;