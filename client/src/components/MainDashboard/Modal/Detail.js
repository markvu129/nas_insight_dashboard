import React, {Component} from 'react';
import Modal from 'react-bootstrap/Modal';
import '../css/Metric.css';
import axios from "axios";
import DemographicVideoChart from "./DemographicVideoChart";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Utils from "../../../modules/Utils";

class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: this.props.modalIsOpen ? this.props.modalIsOpen : false,
            genderData: false,
            countryData: false,
            cityData: false,
            demographicSince: false,
            demographicUntil: false,
        };
        this.fetchDemoGraphicData = this.fetchDemoGraphicData.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.modalIsOpen !== prevProps.modalIsOpen) {
            this.setState({
                modalIsOpen: this.props.modalIsOpen
            })
        }
    }

    fetchDemoGraphicData(since, until){
        if (this.props.activePage !== 'All Pages') {
            axios.get("https://nasinsightserver.herokuapp.com/api/info/overview/nasDailyFB/day/range/" + since + "/" + until + "/page_impressions_by_country_unique,page_impressions_by_city_unique,page_impressions_by_age_gender_unique").
            then((r) => {

                if (r.data.stats[0].stats.length > 0) {
                    this.setState({
                        demographicSince: since,
                        demographicUntil: until,
                        genderData: r.data.stats[0].stats.filter(x => x.name === 'page_impressions_by_age_gender_unique')[0].values[0].value,
                        countryData: r.data.stats[0].stats.filter(x => x.name === 'page_impressions_by_country_unique')[0].values[0].value,
                        cityData: r.data.stats[0].stats.filter(x => x.name === 'page_impressions_by_city_unique')[0].values[0].value
                    })
                }
            });
        }
    }

    componentDidMount() {
        const until = new Date(this.props.allData[0].updatedAt).toISOString().slice(0, 10);
        const since = Utils.subtractCertainDay(until, 11);
        this.fetchDemoGraphicData(since, until);
    }

    render() {

        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1
        };

        let views, views_unique, view_time, reach, metric_time;
        let active_page = this.props.activePage;
        if (active_page === 'All Pages') {
            metric_time = new Date(this.props.allData.updatedAt).toISOString().slice(0, 10);
            views = this.props.allData['total_views'].toLocaleString();
            views_unique = this.props.allData['total_views_unique'].toLocaleString();
            view_time = this.props.allData['total_view_time'].toLocaleString();
            reach = this.props.allData['total_reach'].toLocaleString();
        } else {
            const stats = this.props.allData[0].stats[0].stats;
            metric_time = new Date(this.props.allData[0].updatedAt).toISOString().slice(0, 10);
            views = stats.filter(x => x.name === 'page_video_views')[0].values[0].value.toLocaleString();
            views_unique = stats.filter(x => x.name === 'page_video_views_unique')[0].values[0].value.toLocaleString();
            view_time = Math.round((stats.filter(x => x.name === 'page_video_view_time')[0].values[0].value) / 60000).toLocaleString();
            reach = stats.filter(x => x.name === 'page_impressions_unique')[0].values[0].value.toLocaleString();
        }

        return (
            <Modal id='stats' show={this.state.modalIsOpen} onHide={this.props.closeModal} animation={false}>
                <Modal.Body>
                    <h2 className="daily-detail-title" style={{'color': '#e8c552'}}>{active_page}: {metric_time}</h2>
                    <div className="ms-panel-body p-0">
                        <div className="ms-social-media-followers">
                            <div className="ms-social-grid">
                                <div className="section-icon"><i className="fa fa-tv"></i></div>
                                <p className="ms-text-dark">{views}</p>
                                <span>Video views</span>

                            </div>
                            <div className="ms-social-grid">
                                <div className="section-icon"><i className="fa fa-user"></i></div>
                                <p className="ms-text-dark">{views_unique}</p>
                                <span>Unique views</span>
                            </div>
                        </div>
                    </div>
                    <div className="ms-panel-body p-0">
                        <div className="ms-social-media-followers">
                            <div className="ms-social-grid">
                                <div className="section-icon"><i className="fa fa-hourglass-1"></i></div>
                                <p className="ms-text-dark">{view_time}</p>
                                <span>Video view time (minutes)</span>
                            </div>
                            <div className="ms-social-grid">
                                <div className="section-icon"><i className="fa fa-history"></i></div>
                                <p className="ms-text-dark">{reach}</p>
                                <span>Reach</span>
                            </div>
                        </div>
                    </div>
                    {
                        this.state.genderData && this.state.countryData && this.state.cityData ? (
                            <Slider {...settings}>
                                <DemographicVideoChart label={'Reach by country (' + this.state.demographicSince + '/' + this.state.demographicUntil + ')'} data={this.state.countryData}/>
                                <DemographicVideoChart label={'Reach by city (' + this.state.demographicSince + '/' + this.state.demographicUntil + ')'} data={this.state.cityData}/>
                                <DemographicVideoChart label={'Reach by gender-age (' + this.state.demographicSince + '/' + this.state.demographicUntil + ')'} data={this.state.genderData}/>
                            </Slider>
                        ) : (<div/>)
                    }
                </Modal.Body>
            </Modal>
        )
    }
}

export default Detail;