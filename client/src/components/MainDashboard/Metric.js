import React, {Component} from 'react';
import axios from "axios";
import './css/Metric.css';
import Detail from "./Modal/Detail";
import Modal from "react-bootstrap/Modal";
import FacebookPlayer from "react-facebook-player";

class Metric extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dailyData: {},
            currentIgReach: false,
            prevIgReach: false,
            currentIgProfileViews: false,
            prevIgProfileViews: false,
            pages: ['nasDailyFB', 'nasDailyFBVN', 'nasDailyFBPH', 'nasDailyFBSP', 'nasDailyFBTH', 'nasDailyFBARB', 'nasDailyFBCH'],
            title: {
                'nasDailyFB': 'Nas Daily',
                'nasDailyFBVN': 'NasDaily Vietnam',
                'nasDailyFBARB': 'NasDaily Arabic',
                'nasDailyFBTH': 'NasDaily Thailand',
                'nasDailyFBPH': 'NasDaily Philipines',
                'nasDailyFBCH': 'NasDaily Chinese',
                'nasDailyFBSP': 'NasDaily Espanol',
                'all': 'All Pages'
            },
            activePage: 'nasDailyFB',
            modalIsOpen: {}
        };
        this.fetchFbData = this.fetchFbData.bind(this);
        this.fetchIgData = this.fetchIgData.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    fetchFbData() {
        let fbData = {};
        let fetches = [];
        let totalData = {
            'total_impressions': 0,
            'total_reach': 0,
            'total_views': 0,
            'total_views_unique': 0,
            'total_view_time': 0,
            'total_engaged_users': 0,
            'total_complete_views': 0,
            'updatedAt': ""
        };

        const that = this;
        this.state.pages.forEach(page => {
            let uri = "https://nasinsightserver.herokuapp.com/api/info/overview/" + page + "/day/" + new Date().getFullYear() + "/page_impressions/2";
            fetches.push(axios.get(uri)
                .then(response => {
                    let data = {};
                    data['all_data'] = response.data;
                    let view = response.data[0].stats[0].stats.filter(x => x.name === 'page_video_views')[0].values[0].value;

                    // Calculate total data
                    totalData['updatedAt'] =  response.data[0].updatedAt;
                    totalData['total_views'] = totalData['total_views'] + view;
                    totalData['total_impressions'] =   totalData['total_impressions'] + response.data[0].stats[0].stats.filter(x => x.name === 'page_impressions')[0].values[0].value;
                    totalData['total_reach'] =   totalData['total_impressions_unique'] + response.data[0].stats[0].stats.filter(x => x.name === 'page_impressions_unique')[0].values[0].value;
                    totalData['total_views'] =   totalData['total_views'] + response.data[0].stats[0].stats.filter(x => x.name === 'page_video_views')[0].values[0].value;
                    totalData['total_views_unique'] = totalData['total_views_unique'] + response.data[0].stats[0].stats.filter(x => x.name === 'page_video_views_unique')[0].values[0].value;
                    totalData['total_view_time'] = totalData['total_view_time'] + Math.round((response.data[0].stats[0].stats.filter(x => x.name === 'page_video_view_time')[0].values[0].value)/60000);
                    totalData['total_engaged_users'] = totalData['total_engaged_users'] + response.data[0].stats[0].stats.filter(x => x.name === 'page_engaged_users')[0].values[0].value;
                    totalData['total_complete_views'] = totalData['total_complete_views'] + response.data[0].stats[0].stats.filter(x => x.name === 'page_video_complete_views_30s')[0].values[0].value;

                    // Calculate current data for each site
                    data['currentFbViews'] = view;
                    data['prevFbViews'] = response.data[1].stats[0].stats.filter(x => x.name === 'page_video_views')[0].values[0].value;
                    data['currentFbEngagedUsers'] = response.data[0].stats[0].stats.filter(x => x.name === 'page_engaged_users')[0].values[0].value;
                    data['prevFbEngagedUsers'] = response.data[1].stats[0].stats.filter(x => x.name === 'page_engaged_users')[0].values[0].value;
                    fbData[page] = data;

                })
                .catch(err => console.log(err)));
        });

        // Wait for all fetches to finish
        Promise.all(fetches).then(function () {
            that.setState({
                dailyData: fbData,
                totalData: totalData
            })
        })
    }


    fetchIgData() {
        let uri = "https://nasinsightserver.herokuapp.com/api/info/overview/nasDailyIG/day/" + new Date().getFullYear() + '/page_impressions/2';
        axios.get(uri)
            .then(response => {
                this.setState({
                    currentIgReach: response.data[0].stats[0].stats.filter(x => x.name === 'reach')[0].values,
                    prevIgReach: response.data[1].stats[0].stats.filter(x => x.name === 'reach')[0].values,
                    currentIgProfileViews: response.data[0].stats[0].stats.filter(x => x.name === 'profile_views')[0].values,
                    prevIgProfileViews: response.data[1].stats[0].stats.filter(x => x.name === 'profile_views')[0].values,
                })
            })
            .catch(err => console.log(err))
    }

    openModal(page){
        let currentModalIsOpen = this.state.modalIsOpen;
        currentModalIsOpen[page] = true;
        this.setState({
            activePage: page,
            modalIsOpen: currentModalIsOpen
        })
    }

    closeModal(){
        let currentModalIsOpen = this.state.modalIsOpen;
        currentModalIsOpen[this.state.activePage] = false;
        this.setState({
            modalIsOpen: currentModalIsOpen
        })
    }

    componentWillMount() {
        this.fetchFbData();
        this.fetchIgData();
    }


    render() {
        if (this.state.currentIgProfileViews && this.state.dailyData.nasDailyFBVN
            && this.state.dailyData.nasDailyFBCH && this.state.dailyData.nasDailyFBARB && this.state.dailyData.nasDailyFBTH
            && this.state.dailyData.nasDailyFBPH && this.state.dailyData.nasDailyFBSP && this.state.dailyData.nasDailyFB) {
            return (
                <div className="col-xl-4 col-md-12">
                    <div className="ms-panel ms-panel-fh">
                        <div className="ms-panel-header company-title-div">
                            <h6 id="company-title">The<span className="nas"> NAS </span>Company<span
                                className="nas">.</span></h6>
                        </div>
                        <div className="ms-panel-body p-0">
                            <div className="ms-social-media-followers">
                                <div className="ms-social-grid">
                                    <i className="fa fa-facebook-f bg-facebook" onClick={this.openModal.bind(null, 'all')}></i>
                                    {this.state.totalData ?
                                        <p className="ms-text-dark">{this.state.totalData['total_views'].toLocaleString()}</p> :
                                        <p></p>}
                                    <span>Video views</span>
                                    <p className="ms-text-dark">{this.state.totalData['total_engaged_users'].toLocaleString()}</p>
                                    <span>Engaged users</span>
                                </div>
                                <div className="ms-social-grid">
                                    <i className="fa fa-instagram bg-instagram"></i>
                                    <p className="ms-text-dark">{this.state.currentIgReach.toLocaleString()}</p>
                                    <span>Reach</span>
                                    <p className="ms-text-dark">{this.state.currentIgProfileViews.toLocaleString()}</p>
                                    <span>Views</span>
                                </div>
                            </div>

                            <div className="ms-social-media-followers">
                                <div className="ms-social-grid">
                                    <img src="https://svgshare.com/i/HBs.svg" alt="nasdaily-total"
                                         border="0" className="flag-icon" onClick={this.openModal.bind(null, 'nasDailyFB')}/>
                                    {this.state.dailyData.nasDailyFB ?
                                        <p className="ms-text-dark">{this.state.dailyData.nasDailyFB.currentFbViews.toLocaleString()}</p> :
                                        <p></p>}
                                    <span>Video views</span>
                                    <p className="ms-text-dark">{this.state.dailyData.nasDailyFB.currentFbEngagedUsers.toLocaleString()}</p>
                                    <span>Engaged users</span>
                                </div>
                                <div className="ms-social-grid">
                                    <img src="https://i.ibb.co/gWMzpzk/thailand-flag-medium.png" alt="nasdaily-thailand"
                                         border="0" className="flag-icon" onClick={this.openModal.bind(null, 'nasDailyFBTH')}/>
                                    {this.state.dailyData.nasDailyFBTH ?
                                        <p className="ms-text-dark">{this.state.dailyData.nasDailyFBTH.currentFbViews.toLocaleString()}</p> :
                                        <p></p>}
                                    <span>Video views</span>
                                    <p className="ms-text-dark">{this.state.dailyData.nasDailyFBTH.currentFbEngagedUsers.toLocaleString()}</p>
                                    <span>Engaged users</span>
                                </div>
                            </div>

                            <div className="ms-social-media-followers">
                                <div className="ms-social-grid">
                                    <img src="https://i.ibb.co/jykWfj4/vietnam-flag-icon-128.png" alt="nasdaily-vn"
                                         border="0" className="flag-icon" onClick={this.openModal.bind(null, 'nasDailyFBVN')}/>
                                    {this.state.dailyData.nasDailyFBVN ?
                                        <p className="ms-text-dark">{this.state.dailyData.nasDailyFBVN.currentFbViews.toLocaleString()}</p> :
                                        <p></p>}
                                    <span>Video views</span>
                                    <p className="ms-text-dark">{this.state.dailyData.nasDailyFBVN.currentFbEngagedUsers.toLocaleString()}</p>
                                    <span>Engaged users</span>
                                </div>
                                <div className="ms-social-grid">
                                    <img src="https://i.ibb.co/Qkx9qRw/philippines-flag-icon-64.png" alt="nasdaily-ph"
                                         border="0" className="flag-icon" onClick={this.openModal.bind(null, 'nasDailyFBPH')}/>
                                    {this.state.dailyData.nasDailyFBPH ?
                                        <p className="ms-text-dark">{this.state.dailyData.nasDailyFBPH.currentFbViews.toLocaleString()}</p> :
                                        <p></p>}
                                    <span>Video views</span>
                                    <p className="ms-text-dark">{this.state.dailyData.nasDailyFBPH.currentFbEngagedUsers.toLocaleString()}</p>
                                    <span>Engaged users</span>
                                </div>
                            </div>
                            <div className="ms-social-media-followers">
                                <div className="ms-social-grid">
                                    <img src="https://i.ibb.co/7pvMdfj/spain-flag-icon-64.png" alt="nasdaily-esp"
                                         border="0"
                                         className="flag-icon" onClick={this.openModal.bind(null, 'nasDailyFBSP')}/>
                                    {this.state.dailyData.nasDailyFBSP ?
                                        <p className="ms-text-dark">{this.state.dailyData.nasDailyFBSP.currentFbViews.toLocaleString()}</p> :
                                        <p></p>}
                                    <span>Video views</span>
                                    <p className="ms-text-dark">{this.state.dailyData.nasDailyFBSP.currentFbEngagedUsers.toLocaleString()}</p>
                                    <span>Engaged users</span>
                                </div>
                                <div className="ms-social-grid">
                                    <img src="https://i.ibb.co/9h3848b/arabic.png" alt="nasdaily-arabic" border="0"
                                         className="flag-icon" onClick={this.openModal.bind(null, 'nasDailyFBARB')}/>
                                    {this.state.dailyData.nasDailyFBARB ?
                                        <p className="ms-text-dark">{this.state.dailyData.nasDailyFBARB.currentFbViews.toLocaleString()}</p> :
                                        <p></p>}
                                    <span>Video views</span>
                                    <p className="ms-text-dark">{this.state.dailyData.nasDailyFBARB.currentFbEngagedUsers.toLocaleString()}</p>
                                    <span>Engaged users</span>
                                </div>
                            </div>

                            <div className="ms-social-media-followers">
                                <div className="ms-social-grid">
                                    <img src="https://i.ibb.co/CnZbSDS/chinese-character.png" alt="nasdaily-chinese"
                                         border="0" className="flag-icon" onClick={this.openModal.bind(null, 'nasDailyFBCH')}/>
                                    {this.state.dailyData.nasDailyFBCH ?
                                        <p className="ms-text-dark">{this.state.dailyData.nasDailyFBCH.currentFbViews.toLocaleString()}</p> :
                                        <p></p>}
                                    <span>Video views</span>
                                    <p className="ms-text-dark">{this.state.dailyData.nasDailyFBCH.currentFbEngagedUsers.toLocaleString()}</p>
                                    <span>Engaged users</span>
                                </div>
                                <div className="ms-social-grid">
                                    <img src="https://i.ibb.co/WtqGPqr/indonesia-flag-medium.png" alt="nasdaily-bahasa"
                                         border="0" className="flag-icon" onClick={this.openModal.bind(null, 'nasDailyFBTH')}/>
                                    <p className="ms-text-dark">Coming soon</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            )
        } else {
            return (
                <div></div>
            )
        }

    }

}

export default Metric