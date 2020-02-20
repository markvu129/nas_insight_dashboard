import React, {Component} from 'react';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import FacebookPlayer from "react-facebook-player";
import Select from "react-select";
import "./css/Modal.css";
import Loading from "../../Common/Loading";

class VideoSearchModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentVideo: false,
            modalIsOpen: this.props.modalIsOpen,
            isFormSending: false,
            source: '',
            error: false,
            currentStats: false,
            isLoading: false
        }
        this.fetchVideo = this.fetchVideo.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.renderVideo = this.renderVideo.bind(this);
        this.onSelectSource = this.onSelectSource.bind(this);
        this.renderForm = this.renderForm.bind(this);
    }

    fetchVideo(event) {
        event.preventDefault();
        const {title, id, description} = event.target;
        let postData = {};
        if (title.value && title.value !== '') {
            postData['title'] = title.value;
        } else if (id.value && id.value !== '') {
            postData['video_id'] = id.value;
        } else if (description.value && description.value !== '') {
            postData['description'] = description.value;
        }

        if (this.state.source === '') {
            this.setState({
                error: 'Please fill video source and either id, description or video title'
            })
        }
        else if ((!title.value && !id.value && !description.value) || (title.value === '' && id.value === '' && description.value === '')) {
            this.setState({
                error: 'Please fill video source and either id, description or video title'
            })
        }

        else {
            this.setState({
                isLoading: true
            });
            axios.post('https://nasinsightserver.herokuapp.com/api/video/' + this.state.source + '/1', postData).then((v) => {
                if (v.data.length > 0) {
                    this.setState({
                        currentVideo: v.data[0],
                        isLoading: false,
                        error: false
                    });
                    axios.get('https://nasinsightserver.herokuapp.com/api/videos/video_insights/' + this.state.source + '/' + v.data[0].id).then((r) => {
                        this.setState({
                            currentStats: r.data
                        })
                    })
                }
                else {
                    this.setState({
                        currentVideo: [],
                        currentStats: false,
                        isLoading: false,
                        error: false
                    });
                }
            })
        }
    }

    renderVideo() {
        return (
            <div>
                {this.state.currentVideo && this.state.currentStats ? (
                    <div className="search-video">
                        <h2 className="daily-detail-title"
                            style={{'color': '#0089e9'}}>{this.state.currentVideo.title}</h2>
                        <img src={this.state.currentVideo.picture} className="video-search-img"/>
                        <div className="ms-panel-body p-0">
                            <div className="ms-social-media-followers">
                                <div className="ms-social-grid">
                                    <div className="section-icon"><i className="fa fa-tv"></i></div>
                                    <p className="ms-text-dark">{this.state.currentStats.stats.filter(x => x.name === 'total_video_views')[0].values[0].value.toLocaleString()}</p>
                                    <span>Total Views </span>

                                </div>
                                <div className="ms-social-grid">
                                    <div className="section-icon"><i className="fa fa-volume-up"></i></div>
                                    <p className="ms-text-dark">{this.state.currentStats.stats.filter(x => x.name === 'total_video_views_unique')[0].values[0].value.toLocaleString()}</p>
                                    <span>Total views unique</span>
                                </div>
                            </div>
                        </div>
                        <div className="ms-panel-body p-0">
                            <div className="ms-social-media-followers">
                                <div className="ms-social-grid">
                                    <div className="section-icon"><i className="fa fa-history"></i></div>
                                    <p className="ms-text-dark">{this.state.currentStats.stats.filter(x => x.name === 'total_video_complete_views')[0].values[0].value.toLocaleString()}</p>
                                    <span>Video view complete <br/>(95% length)</span>
                                </div>
                                <div className="ms-social-grid">
                                    <div className="section-icon"><i className="fa fa-user"></i></div>
                                    <p className="ms-text-dark">{this.state.currentStats.stats.filter(x => x.name === 'total_video_impressions_unique')[0].values[0].value.toLocaleString()}</p>
                                    <span>Impressions unique</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="error-msg"></div>
                )}
                {this.state.currentVideo.length === 0 ?
                    <div className="error-msg">No video found</div> : (<div></div>)}
                {this.state.isLoading ? (
                    <Loading/>
                ) : (<div></div>)}
                {this.state.error ? (
                    <p className="error-msg">{this.state.error}</p>
                ) : (<p></p>)}
            </div>
        )
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        })
    }

    componentDidMount() {

    }

    shouldComponentUpdate(nextProps, nextState, nextContent) {
        return this.props.modalIsOpen !== nextProps.modalIsOpen
            || this.state.currentVideo !== nextState.currentVideo || this.state.currentStats !== nextState.currentStats || this.state.errors !== nextState.errors
            || this.state.loading !== nextState.loading
            || this.state.error !== nextState.error
    }

    renderForm() {
        const inputs = ['Title', 'ID', 'Description'];

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

                        default:
                            return <input type="text" placeholder={input} key={input} name={input.toLowerCase()}
                                          className="ui-input"/>;
                    }
                })}
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
                </Modal.Body>
            </Modal>
        )
    }
}

export default VideoSearchModal;
