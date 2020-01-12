import React, {Component} from 'react';
import axios from "axios";
import './css/Metric.css';

class Metric extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dailyData: {},
            currentIgReach: false,
            prevIgReach: false,
            currentIgProfileViews: false,
            prevIgProfileViews: false,
            pages: ['nasDailyFB', 'nasDailyFBVN', 'nasDailyFBPH', 'nasDailyFBSP','nasDailyFBTH', 'nasDailyFBARB', 'nasDailyFBCH']
        };
        this.state.fetchFbData = this.fetchFbData.bind(this);
        this.state.fetchIgData = this.fetchIgData.bind(this);
    }

    fetchFbData() {
        let fbData = {};
        let fetches = [];

        const that = this;
        this.state.pages.forEach(page => {
            let uri = "https://nasinsightserver.herokuapp.com/api/info/overview/" + page + "/day/" + new Date().getFullYear() + "/page_impressions/2";
            axios.get(uri)
                .then(response => {
                    let data = {};
                    data['currentFbViews'] = response.data[0].stats[0].stats.filter(x => x.name === 'page_video_views')[0].values[0].value;
                    data['prevFbViews'] = response.data[1].stats[0].stats.filter(x => x.name === 'page_video_views')[0].values[0].value;
                    data['currentFbEngagedUsers'] = response.data[0].stats[0].stats.filter(x => x.name === 'page_engaged_users')[0].values[0].value;
                    data['prevFbEngagedUsers'] = response.data[1].stats[0].stats.filter(x => x.name === 'page_engaged_users')[0].values[0].value;
                    fbData[page] = data;

                })
                .catch(err => console.log(err))
        });

        Promise.all(fetches).then(function () {
            that.setState({
                dailyData: fbData
            })
        })
    }


    fetchIgData() {
        let uri = "https://nasinsightserver.herokuapp.com/api/info/overview/nasDailyIG/day/" + new Date().getFullYear() + '/page_impressions/2';
        axios.get(uri)
            .then(response => {
                this.setState({
                    currentIgReach: response.data[0].stats[0].stats.filter(x => x.name === 'reach')[0].value,
                    prevIgReach: response.data[1].stats[0].stats.filter(x => x.name === 'reach')[0].value,
                    currentIgProfileViews: response.data[0].stats[0].stats.filter(x => x.name === 'profile_views')[0].value,
                    prevIgProfileViews: response.data[1].stats[0].stats.filter(x => x.name === 'profile_views')[0].value,
                })
            })
            .catch(err => console.log(err))
    }

    componentWillMount() {
        this.fetchFbData();
        this.fetchIgData();
    }


    render() {
        if (this.state.currentIgProfileViews && this.state.dailyData.nasDailyFBVN) {
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
                                    <i className="fa fa-facebook-f bg-facebook"></i>
                                    {this.state.dailyData.nasDailyFB ?
                                        <p className="ms-text-dark">{this.state.dailyData.nasDailyFB.currentFbViews.toLocaleString()}</p> :
                                        <p></p>}
                                    <span>Video views</span>
                                    <p className="ms-text-dark">{this.state.dailyData.nasDailyFB.currentFbEngagedUsers.toLocaleString()}</p>
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
                                    <img src="https://i.ibb.co/jykWfj4/vietnam-flag-icon-128.png" alt="nasdaily-vn"
                                         border="0" className="flag-icon"/>
                                    {this.state.dailyData.nasDailyFBVN ?
                                        <p className="ms-text-dark">{this.state.dailyData.nasDailyFBVN.currentFbViews.toLocaleString()}</p> :
                                        <p></p>}
                                    <span>Video views</span>
                                    <p className="ms-text-dark">{this.state.dailyData.nasDailyFBVN.currentFbEngagedUsers.toLocaleString()}</p>
                                    <span>Engaged users</span>
                                </div>
                                <div className="ms-social-grid">
                                    <img src="https://i.ibb.co/Qkx9qRw/philippines-flag-icon-64.png" alt="nasdaily-ph"
                                         border="0" className="flag-icon"/>
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
                                         className="flag-icon"/>
                                    {this.state.dailyData.nasDailyFBSP ?
                                        <p className="ms-text-dark">{this.state.dailyData.nasDailyFBSP.currentFbViews.toLocaleString()}</p> :
                                        <p></p>}
                                    <span>Video views</span>
                                    <p className="ms-text-dark">{this.state.dailyData.nasDailyFBSP.currentFbEngagedUsers.toLocaleString()}</p>
                                    <span>Engaged users</span>
                                </div>
                                <div className="ms-social-grid">
                                    <img src="https://i.ibb.co/9h3848b/arabic.png" alt="nasdaily-arabic" border="0"
                                         className="flag-icon"/>
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
                                    <img src="https://i.ibb.co/gWMzpzk/thailand-flag-medium.png" alt="nasdaily-thailand"
                                         border="0" className="flag-icon"/>
                                    {this.state.dailyData.nasDailyFBTH ?
                                        <p className="ms-text-dark">{this.state.dailyData.nasDailyFBTH.currentFbViews.toLocaleString()}</p> :
                                        <p></p>}
                                    <span>Video views</span>
                                    <p className="ms-text-dark">{this.state.dailyData.nasDailyFBTH.currentFbEngagedUsers.toLocaleString()}</p>
                                    <span>Engaged users</span>
                                </div>
                                <div className="ms-social-grid">
                                    <img src="https://i.ibb.co/CnZbSDS/chinese-character.png" alt="nasdaily-chinese"
                                         border="0" className="flag-icon"/>
                                    {this.state.dailyData.nasDailyFBCH ?
                                        <p className="ms-text-dark">{this.state.dailyData.nasDailyFBCH.currentFbViews.toLocaleString()}</p> :
                                        <p></p>}
                                    <span>Video views</span>
                                    <p className="ms-text-dark">{this.state.dailyData.nasDailyFBCH.currentFbEngagedUsers.toLocaleString()}</p>
                                    <span>Engaged users</span>
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