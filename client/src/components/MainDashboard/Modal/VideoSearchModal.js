import React, {Component} from 'react';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import Select from "react-select";
import "./css/Modal.css";
import Loading from "../../Common/Loading";
import $ from 'jquery';
import Collapsible from "react-collapsible";
import Pagination from "react-js-pagination";
import DatePicker from "react-datepicker";

class VideoSearchModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentVideos: false,
            allVideos: false,
            modalIsOpen: this.props.modalIsOpen,
            isFormSending: false,
            source: '',
            error: false,
            currentStats: false,
            isLoading: false,
            currentPage: 1,
            startDate: new Date(),
            endDate: new Date(),
            customDate: false,
            startDateFormatted: new Date().toISOString().slice(0, 10),
            endDateFormatted: new Date().toISOString().slice(0, 10)
        };
        this.fetchVideo = this.fetchVideo.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.renderVideo = this.renderVideo.bind(this);
        this.onSelectSource = this.onSelectSource.bind(this);
        this.renderForm = this.renderForm.bind(this);
        this.handlePageChange = this._handlePageChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.changeDateMode = this.changeDateMode.bind(this);
    }

    fetchVideo(event) {
        event.preventDefault();
        const {title, id, description, week} = event.target;
        let postData = {};
        if (title.value && title.value !== '') {
            postData['title'] = title.value;
        } else if (id.value && id.value !== '') {
            postData['video_id'] = id.value;
        } else if (description.value && description.value !== '') {
            postData['description'] = description.value;
        }
        else if (week.value && week.value !== '') {
            postData['week'] = week.value;
        }

        if (this.state.customDate && this.state.startDateFormatted) {
            postData['since'] = this.state.startDateFormatted
        }

        if (this.state.customDate && this.state.endDateFormatted) {
            postData['until'] = this.state.endDateFormatted
        }

        if (this.state.source === '') {
            this.setState({
                error: 'Please fill video source and either id, description, week or video title'
            })
        } else if ((!title.value && !id.value && !description.value && !week.value && !this.state.customDate) || (title.value === '' && id.value === '' && !week.value && description.value === '' && !this.state.customDate)) {
            this.setState({
                error: 'Please fill video source and either id, description, week or video title'
            })
        } else {
            this.setState({
                isLoading: true
            });

            axios.post('https://nasinsightserver.herokuapp.com/api/video/' + this.state.source + '/50', postData).then(async (v) => {
                if (v.data.length > 0) {
                    this.setState({
                        isLoading: false,
                        error: false,
                        noOfPages: Math.ceil(v.data.length / 5),
                        currentPage: 1
                    });

                    let fetches = [];
                    let currentVideos = [];
                    let allVideos = [];

                    for (const video of v.data) {
                        fetches.push(axios.get('https://nasinsightserver.herokuapp.com/api/videos/video_insights/' + this.state.source + '/' + video.id).then((r) => {
                            if (currentVideos.length < 5) {
                                currentVideos.push({video: video, stats: r.data})
                            }
                            allVideos.push({video: video, stats: r.data})
                        }))
                    }

                    await Promise.all(fetches).then(function () {
                    }).catch((e) => {
                        console.log(e)
                    });
                    this.setState({
                        currentVideos: currentVideos,
                        allVideos: allVideos
                    })
                } else {
                    this.setState({
                        currentVideos: [],
                        isLoading: false,
                        error: false,
                        noOfPages: false
                    });
                }
            })
        }
    }

    renderVideo() {
        const currentVideos = this.state.currentVideos;
        let videoList;
        if (currentVideos.length > 0) {
            videoList = currentVideos.map((video) =>
            {
                if (video.stats.stats.length > 0) {
                    return <div className="search-video">
                        <Collapsible trigger={video.video.title} key={video.video.title} className="video-dropdown">
                            <div className="answer">
                                <div className='fifty-width left'>
                                    <p>Published on: {new Date(video.video.created_time).toISOString().slice(0, 10)} - Video ID: {video.video.id}</p>
                                    <img src={video.video.picture} className="video-search-img"/>
                                </div>
                                <div className='fifty-width'>
                                    <div className="ms-panel-body p-0">
                                        <div className="ms-social-media-followers">
                                            <div className="ms-social-grid">
                                                <div className="section-icon"><i className="fa fa-tv"></i></div>
                                                <p className="ms-text-dark">{video.stats.stats.filter(x => x.name === 'total_video_views')[0].values[0].value.toLocaleString()}</p>
                                                <span>Total Views</span>

                                            </div>
                                            <div className="ms-social-grid">
                                                <div className="section-icon"><i className="fa fa-volume-up"></i></div>
                                                <p className="ms-text-dark">{video.stats.stats.filter(x => x.name === 'total_video_views_unique')[0].values[0].value.toLocaleString()}</p>
                                                <span>Unique views</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ms-panel-body p-0">
                                        <div className="ms-social-media-followers">
                                            <div className="ms-social-grid">
                                                <div className="section-icon"><i className="fa fa-history"></i></div>
                                                <p className="ms-text-dark">{video.stats.stats.filter(x => x.name === 'total_video_complete_views')[0].values[0].value.toLocaleString()}</p>
                                                <span>Complete views<br/>(95% length)</span>
                                            </div>
                                            <div className="ms-social-grid">
                                                <div className="section-icon"><i className="fa fa-user"></i></div>
                                                <p className="ms-text-dark">{video.stats.stats.filter(x => x.name ===
                                                    'total_video_impressions_unique')[0].values[0].value.toLocaleString()}</p>
                                                <span>Reach</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Collapsible>
                        <p className="click-for-more">Click to see stats</p>
                    </div>
                }
                else {return <div></div>}
            }

            )

        }

        if (currentVideos && currentVideos.length > 0) {
            return videoList
        } else if (currentVideos.length === 0) {
            return <div className="error-msg">No video found</div>
        }

        if (this.state.isLoading) {
            return <Loading/>
        }
        if (this.state.error) {
            return <p className="error-msg">{this.state.error}</p>
        }
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        })
    }

    componentDidMount() {
        $(".modal-dialog").addClass("video-search-modal");
    }

    shouldComponentUpdate(nextProps, nextState, nextContent) {
        return this.props.modalIsOpen !== nextProps.modalIsOpen
            || this.state.currentVideos !== nextState.currentVideos
            || this.state.currentPage !== nextState.currentPage
            || this.state.loading !== nextState.loading
            || this.state.error !== nextState.error
            || this.state.startDate !== nextState.startDate
            || this.state.endDate !== nextState.endDate
            || this.state.customDate !== nextState.customDate
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

    changeDateMode() {
        this.setState({
            customDate: !this.state.customDate
        })
    }

    renderForm() {
        const inputs = ['Title', 'ID', 'Description', 'Week'];

        return (
            <form className="ui-form p-positions-form" onSubmit={this.fetchVideo}>
                {inputs.map((input) => {
                    switch (input) {
                        case 'Title':
                            return <input type="text" placeholder="Title" key={input}
                                          name="title" className="ui-input"/>;
                        case 'ID':
                            return <input type="text" placeholder="Id" key={input} name="id"
                                          className="ui-input"/>;
                        case 'Description':
                            return <input type="text" placeholder="Description" key={input} name="description"
                                          className="ui-input-desc"/>;
                        case 'Week':
                            return <input type="text" placeholder="Week" key={input} name="week"
                                          className="ui-input-desc"/>;

                        default:
                            return <input type="text" placeholder={input} key={input} name={input.toLowerCase()}
                                          className="ui-input"/>;
                    }
                })}

                {this.state.customDate?
                    (<div className="date-picker">
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
                    <p onClick={this.changeDateMode} className="remove">Remove date</p>
                    </div>) : (<p onClick={this.changeDateMode} className="remove" >Choose date</p>)
                            }
                <button type="submit" className="ui-button-squared">
                    Search
                </button>
            </form>
        )
    }


    onSelectSource(value) {
        this.setState({
            source: value.value
        });
    }

    _handlePageChange(pageNumber) {
        let allVideos = this.state.allVideos;
        this.setState({
            currentPage: pageNumber,
            currentVideos: allVideos.slice((pageNumber-1)*5, pageNumber*5)
        })
    }

    render() {

        let sourceOptions = [{"label": "NasDaily", "value": "nasDailyFB"},
            {"label": "NasDaily Vietnamese", "value": "nasDailyFBVN"},
            {"label": "NasDaily Spanish", "value": "nasDailyFBSP"},
            {"label": "NasDaily Chinese", "value": "nasDailyFBCH"},
            {"label": "NasDaily Tagalog", "value": "nasDailyFBPH"},
            {"label": "NasDaily Arabic", "value": "nasDailyFBARB"},
            {"label": "NasDaily Thai", "value": "nasDailyFBTH"}
        ];

        return (
            <div>
                <Modal show={this.props.modalIsOpen} onHide={this.props.closeModal} animation={false}>
                    <Modal.Body>
                        <p>Please select video source and one of search params</p>
                        <div>
                            <Select className=""
                                    placeholder={this.state.source ? this.state.source : "Select video source"}
                                    options={sourceOptions}
                                    onChange={(value) => this.onSelectSource(value)}/>
                        </div>
                        {this.renderForm()}
                        <br/>
                        {this.renderVideo()}

                        {
                            this.state.allVideos && this.state.allVideos.length > 0 ? (
                                <div className="pagination-div">
                                    <Pagination itemClass="page-item"
                                                linkClass="page-link"
                                        activePage={this.state.currentPage}
                                        itemsCountPerPage={5}
                                        totalItemsCount={this.state.allVideos.length}
                                        pageRangeDisplayed={2}
                                        onChange={this.handlePageChange}
                                    />
                                </div>
                            ) : (<div/>)
                        }

                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}

export default VideoSearchModal;
