import React, {Component} from 'react';
import axios from "axios";
import './css/Metric.css';
import Detail from "./Modal/Detail";

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
                'nasDailyFBVN': 'NasDaily Vietnamese',
                'nasDailyFBARB': 'NasDaily Arabic',
                'nasDailyFBTH': 'NasDaily Thai',
                'nasDailyFBPH': 'NasDaily Tagalog',
                'nasDailyFBCH': 'NasDaily Chinese',
                'nasDailyFBSP': 'NasDaily Spanish',
                'all': 'All Pages'
            },
            activePage: 'nasDailyFB',
            modalIsOpen: {},
            followerCounts: {},
            totalFollowerCount: 0
        };
        this.fetchFbData = this.fetchFbData.bind(this);
        this.fetchIgData = this.fetchIgData.bind(this);
        this.fetchFollowers = this.fetchFollowers.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    fetchFbData() {
        let fbData = {};
        let fetches = [];
        let totalData = {
        };

        const that = this;
        let total_views = 0;
        let total_reach = 0;
        let total_views_unique = 0;
        let total_view_time = 0;
        let total_engaged_users = 0;
        let total_complete_views = 0;
        let total_impressions = 0;
        let updated_at;
        this.state.pages.forEach(page => {
            let uri = "https://nasinsightserver.herokuapp.com/api/info/overview/" + page + "/day/" + new Date().getFullYear() + "/page_impressions/2";
            fetches.push(axios.get(uri)
                .then(response => {
                    let data = {};
                    data['all_data'] = response.data;
                    let view = response.data[0].stats[0].stats.filter(x => x.name === 'page_video_views')[0].values[0].value;

                    // Calculate total data
                    updated_at = response.data[0].updatedAt;
                    total_views = total_views + view;
                    total_impressions = total_impressions + response.data[0].stats[0].stats.filter(x => x.name === 'page_impressions')[0].values[0].value;
                    total_reach = total_reach + response.data[0].stats[0].stats.filter(x => x.name === 'page_impressions_unique')[0].values[0].value;
                    total_views_unique = total_views_unique + response.data[0].stats[0].stats.filter(x => x.name === 'page_video_views_unique')[0].values[0].value;
                    total_view_time = total_view_time + Math.round((response.data[0].stats[0].stats.filter(x => x.name === 'page_video_view_time')[0].values[0].value)/60000);
                    total_engaged_users = total_engaged_users + response.data[0].stats[0].stats.filter(x => x.name === 'page_engaged_users')[0].values[0].value;
                    total_complete_views = total_complete_views + response.data[0].stats[0].stats.filter(x => x.name === 'page_video_complete_views_30s')[0].values[0].value;

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
            totalData.total_views = total_views;
            totalData.total_impressions = total_impressions;
            totalData.total_reach = total_reach;
            totalData.total_views_unique = total_views_unique;
            totalData.total_view_time = total_view_time;
            totalData.total_engaged_users = total_engaged_users;
            totalData.total_complete_views = total_complete_views;
            totalData.updatedAt = updated_at;
            that.setState({
                dailyData: fbData,
                totalData: totalData
            })
        })
    }

    fetchFollowers(){
        axios.get('https://nasinsightserver.herokuapp.com/api/followers/all').then(response => {
            let data = response.data[0];
            this.setState({
                followerCounts: data,
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
        this.fetchFollowers();
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
                                    {this.state.followerCounts ?
                                        <p className="ms-text-dark highlight-text">{this.state.followerCounts['all']}</p> :
                                        <p></p>}
                                    <span>Followers</span>
                                    {this.state.totalData ?
                                        <p className="ms-text-dark">{this.state.totalData['total_views'].toLocaleString()}</p> :
                                        <p></p>}
                                    <span>Video views</span>
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
                                    <p className="source-name">Main</p>
                                    <img className="flag-icon" src="/assets/img/images/nasdaily_logo.png" onClick={this.openModal.bind(null, 'nasDailyFB')}></img>
                                    {this.state.followerCounts ?
                                        <p className="ms-text-dark highlight-text">{this.state.followerCounts['nasDailyFB']}</p> :
                                        <p></p>}
                                    <span>Followers</span>
                                    {this.state.dailyData.nasDailyFB ?
                                        <p className="ms-text-dark">{this.state.dailyData.nasDailyFB.currentFbViews.toLocaleString()}</p> :
                                        <p></p>}
                                    <span>Video views</span>
                                </div>
                                <div className="ms-social-grid">
                                    <p className="source-name">Thai</p>
                                    <img src="/assets/img/images/nasdaily_logo.png" alt="nasdaily-thailand"
                                         border="0" className="flag-icon" onClick={this.openModal.bind(null, 'nasDailyFBTH')}/>
                                    {this.state.followerCounts ?
                                        <p className="ms-text-dark highlight-text">{this.state.followerCounts['nasDailyFBTH']}</p> :
                                        <p></p>}
                                    <span>Followers</span>
                                    {this.state.dailyData.nasDailyFBTH ?
                                        <p className="ms-text-dark">{this.state.dailyData.nasDailyFBTH.currentFbViews.toLocaleString()}</p> :
                                        <p></p>}
                                    <span>Video views</span>
                                </div>
                            </div>

                            <div className="ms-social-media-followers">
                                <div className="ms-social-grid">
                                    <p className="source-name">Vietnamese</p>
                                    <img src="/assets/img/images/nasdaily_logo.png" alt="nasdaily-vn"
                                         border="0" className="flag-icon" onClick={this.openModal.bind(null, 'nasDailyFBVN')}/>
                                    {this.state.followerCounts ?
                                        <p className="ms-text-dark highlight-text">{this.state.followerCounts['nasDailyFBVN']}</p> :
                                        <p></p>}
                                    <span>Followers</span>
                                    {this.state.dailyData.nasDailyFBVN ?
                                        <p className="ms-text-dark">{this.state.dailyData.nasDailyFBVN.currentFbViews.toLocaleString()}</p> :
                                        <p></p>}
                                    <span>Video views</span>
                                </div>
                                <div className="ms-social-grid">
                                    <p className="source-name">Tagalog</p>
                                    <img src="/assets/img/images/nasdaily_logo.png" alt="nasdaily-ph"
                                         border="0" className="flag-icon" onClick={this.openModal.bind(null, 'nasDailyFBPH')}/>
                                    {this.state.followerCounts ?
                                        <p className="ms-text-dark highlight-text">{this.state.followerCounts['nasDailyFBPH']}</p> :
                                        <p></p>}
                                    <span>Followers</span>
                                    {this.state.dailyData.nasDailyFBPH ?
                                        <p className="ms-text-dark">{this.state.dailyData.nasDailyFBPH.currentFbViews.toLocaleString()}</p> :
                                        <p></p>}
                                    <span>Video views</span>
                                </div>
                            </div>
                            <div className="ms-social-media-followers">
                                <div className="ms-social-grid">
                                    <p className="source-name">Spanish</p>
                                    <img src="/assets/img/images/nasdaily_logo.png" alt="nasdaily-esp"
                                         border="0"
                                         className="flag-icon" onClick={this.openModal.bind(null, 'nasDailyFBSP')}/>
                                    {this.state.followerCounts ?
                                        <p className="ms-text-dark highlight-text">{this.state.followerCounts['nasDailyFBSP']}</p> :
                                        <p></p>}
                                    <span>Followers</span>
                                    {this.state.dailyData.nasDailyFBSP ?
                                        <p className="ms-text-dark">{this.state.dailyData.nasDailyFBSP.currentFbViews.toLocaleString()}</p> :
                                        <p></p>}
                                    <span>Video views</span>
                                </div>
                                <div className="ms-social-grid">
                                    <p className="source-name">Arabic</p>
                                    <img src="/assets/img/images/nasdaily_logo.png" alt="nasdaily-arabic" border="0"
                                         className="flag-icon" onClick={this.openModal.bind(null, 'nasDailyFBARB')}/>
                                    {this.state.followerCounts ?
                                        <p className="ms-text-dark highlight-text">{this.state.followerCounts['nasDailyFBARB']}</p> :
                                        <p></p>}
                                    <span>Followers</span>
                                    {this.state.dailyData.nasDailyFBARB ?
                                        <p className="ms-text-dark">{this.state.dailyData.nasDailyFBARB.currentFbViews.toLocaleString()}</p> :
                                        <p></p>}
                                    <span>Video views</span>
                                </div>
                            </div>

                            <div className="ms-social-media-followers">
                                <div className="ms-social-grid">
                                    <p className="source-name">Chinese</p>
                                    <img src="/assets/img/images/nasdaily_logo.png" alt="nasdaily-chinese"
                                         border="0" className="flag-icon" onClick={this.openModal.bind(null, 'nasDailyFBCH')}/>
                                    {this.state.followerCounts ?
                                        <p className="ms-text-dark highlight-text">{this.state.followerCounts['nasDailyFBCH']}</p> :
                                        <p></p>}
                                    <span>Followers</span>
                                    {this.state.dailyData.nasDailyFBCH ?
                                        <p className="ms-text-dark">{this.state.dailyData.nasDailyFBCH.currentFbViews.toLocaleString()}</p> :
                                        <p></p>}
                                    <span>Video views</span>
                                </div>
                                <div className="ms-social-grid">
                                    <p className="source-name">Portuguese</p>
                                    <img src="/assets/img/images/nasdaily_logo.png" alt="nasdaily-bahasa"
                                         border="0" className="flag-icon" onClick={this.openModal.bind(null, 'nasDailyFBTH')}/>
                                    <p className="ms-text-dark">Coming soon</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Detail modalIsOpen={this.state.modalIsOpen[this.state.activePage]}
                            closeModal={this.closeModal}
                            activePage={this.state.title[this.state.activePage]}
                            allData={this.state.activePage === 'all' ? this.state.totalData : this.state.dailyData[this.state.activePage]['all_data']}
                    />
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