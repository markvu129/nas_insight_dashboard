import React, {Component} from 'react';
import Modal from 'react-bootstrap/Modal';
import '../css/Metric.css';

class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: this.props.modalIsOpen ? this.props.modalIsOpen : false
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.modalIsOpen !== prevProps.modalIsOpen) {
            this.setState({
                modalIsOpen: this.props.modalIsOpen
            })
        }
    }

    render() {
        const stats = this.props.allData[0].stats[0].stats;
        return (
            <Modal id='stats' show={this.state.modalIsOpen} onHide={this.props.closeModal} animation={false}>
                <Modal.Body>
                    <h2 className="daily-detail-title" style={{ 'color': '#e8c552'}}>{this.props.activePage}: {new Date(this.props.allData[0].updatedAt).toISOString().slice(0,10)}</h2>
                    <div className="ms-panel-body p-0">
                        <div className="ms-social-media-followers">
                            <div className="ms-social-grid">
                                <p className="ms-text-dark">{stats.filter(x => x.name === 'page_video_views')[0].values[0].value.toLocaleString()}</p>
                                <span>Video views</span>

                            </div>
                            <div className="ms-social-grid">
                                <p className="ms-text-dark">{stats.filter(x => x.name === 'page_video_views_unique')[0].values[0].value.toLocaleString()}</p>
                                <span>Video views unique</span>
                            </div>
                        </div>
                    </div>
                    <div className="ms-panel-body p-0">
                        <div className="ms-social-media-followers">
                            <div className="ms-social-grid">
                                <p className="ms-text-dark">{Math.round((stats.filter(x => x.name === 'page_video_view_time')[0].values[0].value) / 60000).toLocaleString()} minutes</p>
                                <span>Page video view time</span>
                            </div>
                            <div className="ms-social-grid">
                                <p className="ms-text-dark">{stats.filter(x => x.name === 'page_video_complete_views_30s')[0].values[0].value.toLocaleString()}</p>
                                <span>Video views complete 30s</span>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }
}

export default Detail;