import React, {Component} from 'react';
import Modal from 'react-bootstrap/Modal';
import '../css/Metric.css';
import DatePicker from "react-datepicker";
import axios from "axios";
import Utils from "../../../modules/Utils";

class YoutubeDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: this.props.modalIsOpen,
            updatedAt: this.props.data.updatedAt,
            views: this.props.data.stats[0][1],
            likes: this.props.data.stats[0][2],
            dislikes: this.props.data.stats[0][3],
            shares: this.props.data.stats[0][4],
            avg_view_duration: this.props.data.stats[0][5],
            subscribers: this.props.subscribers,
            subscribers_gain: this.props.data.stats[0][7],
            subscribers_lost: this.props.data.stats[0][8],
            startDate: new Date(),
            endDate: new Date(),
            startDateFormatted: new Date().toISOString().slice(0, 10),
            endDateFormatted: new Date().toISOString().slice(0, 10),
            channel: "UCJsUvAqDzczYv2UpFmu4PcA"
        };
        this.fetchDataByDate = this.fetchDataByDate.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.modalIsOpen !== prevProps.modalIsOpen) {
            this.setState({
                modalIsOpen: this.props.modalIsOpen
            })
        }
        if (this.state.views !== prevState.views) {
            this.setState({
                views: this.state.views
            })
        }
    }

    handleStartDateChange(date) {
        this.setState({
            startDate: date,
            startDateFormatted: new Date(date).toISOString().slice(0, 10)
        });
    };

    handleEndDateChange(date) {
        this.setState({
            endDate: date,
            endDateFormatted: new Date(date).toISOString().slice(0, 10)
        })
    };

    fetchDataByDate(start, end) {
        axios.get("https://nasinsightserver.herokuapp.com/api/info/youtube/" + this.state.channel + "/views,likes,dislikes,shares,averageViewDuration,estimatedMinutesWatched,subscribersGained,subscribersLost/day/day/" + start + "/" + end)
            .then((res) => {
            if (res.data.stats.length > 0) {
                const ytData = Utils.combineYouTubeData(res.data.stats);
                this.setState({
                    updatedAt: ytData['start'] + " - " + ytData['end'],
                    views: ytData['views'],
                    likes: ytData['likes'],
                    dislikes: ytData['dislikes'],
                    shares: ytData['shares'],
                    avg_view_duration: ytData['averageViewDuration'],
                    subscribers: this.props.subscribers,
                    subscribers_gain: ytData['subscribersGained'],
                    subscribers_lost: ytData['subscribersLost']
                })
            }})
    }

    render() {
        return (
            <Modal show={this.state.modalIsOpen} onHide={this.props.closeModal} animation={false}>
                <Modal.Body>
                    <h2 className="daily-detail-title" style={{'color': '#e8c552'}}>Youtube: {this.state.updatedAt}</h2>
                    <div style={{marginBottom: '40px'}}>
                        <div className="start-date">
                            <span className="filter-desc">From</span>
                            <DatePicker
                                selected={this.state.startDate}
                                onChange={this.handleStartDateChange}
                            />
                        </div>
                        <div className="end-date">
                            <span className="filter-desc">To</span>
                            <DatePicker
                                selected={this.state.endDate}
                                onChange={this.handleEndDateChange}
                            />
                        </div>
                        <i className="fa fa-search fa-search-icon" style={{marginTop: '-25px'}}
                           onClick={() => this.fetchDataByDate(this.state.startDateFormatted, this.state.endDateFormatted)}></i>
                    </div>
                    <div className="ms-panel-body p-0">
                        <div className="ms-social-media-followers">
                            <div className="ms-social-grid">
                                <div className="section-icon"><i className="fa fa-tv"></i></div>
                                <p className="ms-text-dark">{this.state.views.toLocaleString()}</p>
                                <span>Views</span>
                            </div>
                            <div className="ms-social-grid">
                                <div className="section-icon"><i className="fa fa-tv"></i></div>
                                <p className="ms-text-dark">{this.state.likes.toLocaleString()}</p>
                                <span>Likes</span>
                            </div>
                        </div>
                        <div className="ms-social-media-followers">
                            <div className="ms-social-grid">
                                <div className="section-icon"><i className="fa fa-tv"></i></div>
                                <p className="ms-text-dark">{this.state.dislikes.toLocaleString()}</p>
                                <span>Dislikes</span>
                            </div>
                            <div className="ms-social-grid">
                                <div className="section-icon"><i className="fa fa-tv"></i></div>
                                <p className="ms-text-dark">{this.state.shares.toLocaleString()}</p>
                                <span>Shares</span>
                            </div>
                        </div>
                        <div className="ms-social-media-followers">
                            <div className="ms-social-grid">
                                <div className="section-icon"><i className="fa fa-tv"></i></div>
                                <p className="ms-text-dark">{this.state.avg_view_duration.toLocaleString()}</p>
                                <span>Average view duration (secs)</span>
                            </div>
                            <div className="ms-social-grid">
                                <div className="section-icon"><i className="fa fa-tv"></i></div>
                                <p className="ms-text-dark">{this.props.subscribers.toLocaleString()}</p>
                                <span>Subscribers</span>
                            </div>
                        </div>
                        <div className="ms-social-media-followers">
                            <div className="ms-social-grid">
                                <div className="section-icon"><i className="fa fa-tv"></i></div>
                                <p className="ms-text-dark">{this.state.subscribers_gain}</p>
                                <span>Subscribers gained</span>
                            </div>
                            <div className="ms-social-grid">
                                <div className="section-icon"><i className="fa fa-tv"></i></div>
                                <p className="ms-text-dark">{this.state.subscribers_lost}</p>
                                <span>Subscribers lost</span>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }
}

export default YoutubeDetail;