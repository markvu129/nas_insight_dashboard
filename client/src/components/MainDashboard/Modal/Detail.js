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

        let views, views_unique, view_time, complete_view, metric_time;
        let active_page = this.props.activePage;
        if (active_page === 'All Pages') {
            metric_time = new Date(this.props.allData.updatedAt).toISOString().slice(0,10);
            views = this.props.allData['total_views'].toLocaleString();
            views_unique = this.props.allData['total_views_unique'].toLocaleString();
            view_time = this.props.allData['total_view_time'].toLocaleString();
            complete_view =  this.props.allData['total_complete_views'].toLocaleString();
        }
        else {
            const stats = this.props.allData[0].stats[0].stats;
            metric_time = new Date(this.props.allData[0].updatedAt).toISOString().slice(0,10);
            views = stats.filter(x => x.name === 'page_video_views')[0].values[0].value.toLocaleString();
            views_unique = stats.filter(x => x.name === 'page_video_views_unique')[0].values[0].value.toLocaleString();
            view_time = Math.round((stats.filter(x => x.name === 'page_video_view_time')[0].values[0].value) / 60000).toLocaleString();
            complete_view = stats.filter(x => x.name === 'page_video_complete_views_30s')[0].values[0].value.toLocaleString();
        }

        return (
            <Modal id='stats' show={this.state.modalIsOpen} onHide={this.props.closeModal} animation={false}>
                <Modal.Body>
                    <h2 className="daily-detail-title" style={{ 'color': '#e8c552'}}>{active_page}: {metric_time}</h2>
                    <div className="ms-panel-body p-0">
                        <div className="ms-social-media-followers">
                            <div className="ms-social-grid">
                                <p className="ms-text-dark">{views}</p>
                                <span>Video views</span>

                            </div>
                            <div className="ms-social-grid">
                                <p className="ms-text-dark">{views_unique}</p>
                                <span>Video views unique</span>
                            </div>
                        </div>
                    </div>
                    <div className="ms-panel-body p-0">
                        <div className="ms-social-media-followers">
                            <div className="ms-social-grid">
                                <p className="ms-text-dark">{view_time}</p>
                                <span>Page video view time (minutes)</span>
                            </div>
                            <div className="ms-social-grid">
                                <p className="ms-text-dark">{complete_view}</p>
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