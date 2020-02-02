import React, {Component} from 'react';


class VideoDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: this.props.modalIsOpen ? this.props.modalIsOpen : false
        };
        this.onPlayerReady = this.onPlayerReady.bind(this);
    }

    onPlayerReady(_id, player) {
        player.unmute();
        player.play();
    }

    componentDidUpdate(prevProps) {
        if (this.props.modalIsOpen !== prevProps.modalIsOpen) {
            this.setState({
                modalIsOpen: this.props.modalIsOpen
            })
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContent) {
        return this.props.videos !== nextProps.videos
    }

    componentDidMount() {
        console.log(this.state.modalIsOpen)
        console.log(this.props.video)
    }

    render(){
        if (this.props.video && this.state.modalIsOpen) {
            return (
                <Modal id='stats' show={this.state.modalIsOpen} onHide={this.props.closeModal} animation={false}>
                    <Modal.Body>
                        <h2 className="daily-detail-title" style={{ 'color': '#e8c552'}}>{this.props.video.title}</h2>
                        <FacebookPlayer
                            appId={880756785680649}
                            videoId={this.props.video.id}
                            id={`video-id-${this.props.video.id}`}
                            onReady={this.onPlayerReady}
                        />
                        <div className="ms-panel-body p-0">
                            <div className="ms-social-media-followers">
                                <div className="ms-social-grid">
                                    <div className="section-icon"><i className="fa fa-tv"></i></div>
                                    <p className="ms-text-dark"></p>
                                    <span>Video views</span>

                                </div>
                                <div className="ms-social-grid">
                                    <div className="section-icon"><i className="fa fa-user"></i></div>
                                    <p className="ms-text-dark"></p>
                                    <span>Video views unique</span>
                                </div>
                            </div>
                        </div>
                        <div className="ms-panel-body p-0">
                            <div className="ms-social-media-followers">
                                <div className="ms-social-grid">
                                    <div className="section-icon"><i className="fa fa-hourglass-1"></i></div>
                                    <p className="ms-text-dark"></p>
                                    <span>Video view time (minutes)</span>
                                </div>
                                <div className="ms-social-grid">
                                    <div className="section-icon"><i className="fa fa-history"></i></div>
                                    <p className="ms-text-dark"></p>
                                    <span>Views complete 30s</span>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            )
        }
        else {
            return (<Modal id='stats' show={this.state.modalIsOpen} onHide={this.props.closeModal} animation={false}></Modal>)
        }
    }

}

export default VideoDetail;