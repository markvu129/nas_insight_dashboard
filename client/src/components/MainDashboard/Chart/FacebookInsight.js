import React, {Component} from 'react';
import axios from "axios";
import FbChart from "./FacebookChart";
import Select from 'react-select';
import '../css/FacebookChart.css';
import IgChart from './InstagramChart';
import Loading from "../../Common/Loading";
import Modal from 'react-bootstrap/Modal';
import DatePicker from "react-datepicker";
import '../css/Filter.css';
import "react-datepicker/dist/react-datepicker.css";

class FacebookInsight extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentMonthData: false,
            prevMonthData: false,
            monthlyGraphData: {
                nasDailyFB: {
                    data: []
                }
            },
            metric: 'page_impressions',
            currentMonthIgData: false,
            prevMonthIgData: false,
            monthlyIgGraphData: [],
            igMetric: 'reach',
            pages: ['nasDailyFB', 'nasDailyFBVN', 'nasDailyFBPH', 'nasDailyFBSP', 'nasDailyFBTH', 'nasDailyFBARB', 'nasDailyFBCH'],
            startDate: new Date(),
            endDate: new Date(),
            startDateFormatted: new Date(),
            endDateFormatted: new Date(),
            modalIsOpen: false,
            currentFilterState: 'month'
        };
        this.fetchMonthlyData = this.fetchMonthlyData.bind(this);
        this.fetchMonthlyIgData = this.fetchMonthlyIgData.bind(this);
        this.onSelectMetrics = this.onSelectMetrics.bind(this);
        this.onSelectIgMetrics = this.onSelectIgMetrics.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
        this.clearFilter = this.clearFilter.bind(this);
    }

    fetchMonthlyData(metric) {
        this.setState({
            currentFilterState: 'month'
        });

        let monthlyGraphData = {};
        let fetches = [];

        const that = this;

        this.state.pages.forEach(page => {
            let uri = "https://nasinsightserver.herokuapp.com/api/info/overview/" + page + "/month/2019/page_impressions/12";

            fetches.push(axios.get(uri)
                .then(response => {
                    let currentMonthlyGraphData = [];
                    let currentMonthlyGraphLabels = [];
                    // Get engaged users for each month and set to state
                    for (let i = 0; i < response.data.length; i++) {
                        let monthly_data = response.data[i].stats[0];
                        currentMonthlyGraphLabels.push(monthly_data.month);
                        currentMonthlyGraphData.push(monthly_data.stats.filter(x => x.name === metric)[0].value);
                    }
                    let data = {};
                    data['all_data'] = response.data;
                    data['labels'] = currentMonthlyGraphLabels;
                    data['data'] = currentMonthlyGraphData;
                    data['currentMonthData'] = currentMonthlyGraphData[0];
                    data['prevMonthData'] = currentMonthlyGraphData[1];
                    monthlyGraphData[page] = data;
                })
                .catch(err => console.log(err)));
        });

        // Wait for all fetches to finish
        Promise.all(fetches).then(function () {
            that.setState({
                monthlyGraphData: monthlyGraphData
            })
        })
    }

    fetchDataByDateRange(startDate, endDate, metric) {
        this.setState({
            currentFilterState: 'day'
        });

        let monthlyGraphData = {};
        let fetches = [];

        const that = this;

        this.state.pages.forEach(page => {
            let uri = "https://nasinsightserver.herokuapp.com/api/info/overview/" + page + "/day/range/" + startDate + "/" + endDate + "/" + metric;

            fetches.push(axios.get(uri)
                .then(response => {
                    let currentMonthlyGraphData = [];
                    let currentMonthlyGraphLabels = [];
                    // Get engaged users for each month and set to state
                    let values = response.data.stats[0].stats[0].values;
                    for (let i = 0; i < values.length; i++) {
                        currentMonthlyGraphLabels.push(new Date(values[i].end_time).toISOString().slice(0, 10));
                        currentMonthlyGraphData.push(values[i].value);
                    }
                    let data = {};
                    data['all_data'] = response.data;
                    data['labels'] = currentMonthlyGraphLabels;
                    data['data'] = currentMonthlyGraphData;
                    data['currentMonthData'] = currentMonthlyGraphData[0];
                    data['prevMonthData'] = currentMonthlyGraphData[1];
                    monthlyGraphData[page] = data;
                })
                .catch(err => console.log(err)));
        });

        // Wait for all fetches to finish
        Promise.all(fetches).then(function () {
            that.setState({
                monthlyGraphData: monthlyGraphData
            })
        })
    }

    fetchMonthlyIgData(metric) {
        let uri = "https://nasinsightserver.herokuapp.com/api/info/overview/nasDailyIG/month/2019/reach/12";

        axios.get(uri)
            .then(response => {
                let currentMonthlyGraphData = [];
                let currentMonthlyGraphLabels = [];
                // Get engaged users for each month and set to state
                for (let i = 0; i < response.data.length; i++) {
                    let monthly_data = response.data[i].stats[0];
                    currentMonthlyGraphLabels.push(monthly_data.month);
                    currentMonthlyGraphData.push(monthly_data.stats.filter(x => x.name === metric)[0].values);
                }
                this.setState({
                    allIgData: response.data,
                    monthlyIgGraphData: currentMonthlyGraphData,
                    monthlyIgGraphLabels: currentMonthlyGraphLabels,
                    currentMonthIgData: currentMonthlyGraphData[0],
                    prevMonthIgData: currentMonthlyGraphData[1]
                })

            })
            .catch(err => console.log(err))

    }


    onSelectMetrics(value, currentFilterState) {
        this.setState({
            metric: value.value
        });
        let monthlyGraphData = this.state.monthlyGraphData;
        this.state.pages.forEach(async page => {
            let all_data = monthlyGraphData[page]['all_data'];
            let currentMonthlyGraphData = [];
            let currentMonthlyGraphLabels = [];
            if (currentFilterState === 'month') {
                for (let i = 0; i < all_data.length; i++) {
                    let monthly_data = all_data[i].stats[0];
                    currentMonthlyGraphLabels.push(monthly_data.month);
                    currentMonthlyGraphData.push(monthly_data.stats.filter(x => x.name === value.value)[0].value);
                }
            }
            else if (currentFilterState === 'day') {
                let values = all_data.stats[0].stats[0].values;
                for (let i = 0; i < values.length; i++) {
                    currentMonthlyGraphLabels.push(new Date(values[i].end_time).toISOString().slice(0, 10));
                    currentMonthlyGraphData.push(values[i].value);
                }
            }

            let data = {};
            data['all_data'] = all_data;
            data['labels'] = currentMonthlyGraphLabels;
            data['data'] = currentMonthlyGraphData;
            data['currentMonthData'] = currentMonthlyGraphData[0];
            data['prevMonthData'] = currentMonthlyGraphData[1];
            monthlyGraphData[page] = data;
        });
        this.setState({
            monthlyGraphData: monthlyGraphData
        })
    }

    onSelectIgMetrics(value) {
        this.setState({
            igMetric: value.value
        });
        let all_data = this.state.allIgData;
        let currentMonthlyGraphData = [];
        let currentMonthlyGraphLabels = [];
        // Get engaged users for each month and set to state
        for (let i = 0; i < all_data.length; i++) {
            let monthly_data = all_data[i].stats[0];
            currentMonthlyGraphLabels.push(monthly_data.month);
            currentMonthlyGraphData.push(monthly_data.stats.filter(x => x.name === value.value)[0].values);
        }
        this.setState({
            allIgData: all_data,
            monthlyIgGraphData: currentMonthlyGraphData,
            monthlyIgGraphLabels: currentMonthlyGraphLabels,
            currentMonthIgData: currentMonthlyGraphData[0],
            prevMonthIgData: currentMonthlyGraphData[1]

        })
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

    openModal() {
        this.setState({
            modalIsOpen: true
        })
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        })
    }

    applyFilter(startDate, endDate, metric) {
        this.fetchDataByDateRange(startDate, endDate, metric);
        this.setState({
            modalIsOpen: false
        })
    }

    clearFilter() {
        this.fetchMonthlyData('page_impressions');
        this.setState({
            modalIsOpen: false,
            metric: 'page_impressions'
        })
    }


    componentDidMount() {
        this.fetchMonthlyData(this.state.metric);
        this.fetchMonthlyIgData(this.state.igMetric);
    }

    shouldComponentUpdate(nextProps, nextState, nextContent) {
        return this.state.monthlyGraphData != nextState.monthlyGraphData
            || this.state.metric != nextState.metric
            || this.state.igMetric != nextState.igMetric
            || this.state.monthlyIgGraphData != nextState.monthlyIgGraphData
            || this.state.modalIsOpen != nextState.modalIsOpen
            || this.state.startDate != nextState.startDate
            || this.state.endDate != nextState.endDate
    }

    render() {

        let metricMap = {
            'page_video_views': 'Page Total Video Views',
            "page_video_views_paid": "Page Video Views Paid",
            "page_video_views_organic": "Page Video Views Organic",
            "page_video_views_unique": "Page Video Views Unique",
            "page_video_repeat_views": "Page Video Repeat Views",
            "page_video_complete_views_30s": "Page Video Complete View 30s",
            "page_video_views_10s": "Page Video Views 10s",
            "page_video_view_time": "Page Video View Time",
            'page_impressions': 'Page Impressions',
            'page_impressions_paid': 'Page Impressions Paid',
            'page_impressions_organic': 'Page Impressions Organic',
            "page_impressions_viral": "Page Impressions Viral",
            "page_views_total": "Page Views Total",
            "page_views_logged_in_unique": "Page Views Logged In Unique"
        };

        let metricOptions = [{"label": "page_impressions", "value": "page_impressions"},
            {"label": "page_impressions_paid", "value": "page_impressions_paid"},
            {"label": "page_impressions_organic", "value": "page_impressions_organic"},
            {"label": "page_impressions_viral", "value": "page_impressions_viral"},
            {"label": "page_views_logged_in_unique", "value": "page_views_logged_in_unique"},
            {"label": "page_views_total", "value": "page_views_total"},
            {"label": "page_video_views", "value": "page_video_views"},
            {"label": "page_video_views_paid", "value": "page_video_views_paid"},
            {"label": "page_video_views_organic", "value": "page_video_views_organic"},
            {"label": "page_video_views_unique", "value": "page_video_views_unique"},
            {"label": "page_video_repeat_views", "value": "page_video_repeat_views"},
            {"label": "page_video_complete_views_30s", "value": "page_video_complete_views_30s"},
            {"label": "page_video_views_10s", "value": "page_video_views_10s"},
            {"label": "page_video_view_time", "value": "page_video_view_time"},

        ];

        let igMetricMap = {
            'reach': 'Reach',
            'impressions': 'Impressions',
            'profile_views': 'Profile Views'
        }

        let igMetricOptions = [{"label": "reach", "value": "reach"},
            {"label": "impressions", "value": "impressions"},
            {"label": "profile_views", "value": "profile_views"}
        ]

        if (this.state.monthlyGraphData['nasDailyFB']['data'] && this.state.monthlyGraphData['nasDailyFB']['data'].length > 0 && this.state.monthlyIgGraphData.length > 0) {
            return (
                <div className="col-xl-8 col-md-9">
                    <div className="ms-panel ms-panel-fh ms-facebook-engagements">
                        <div className="ms-panel-header">
                            <h6>Engagements/Impressions/Views</h6>
                        </div>
                        <div className="ms-panel-body p-0">
                            <ul className="ms-list clearfix">
                                <li className="ms-list-item">
                                    <div className="ms-graph-data-div">
                                        <div className="ms-graph-data-title">
                                            <h2 className="select-metric">{metricMap[this.state.metric]}</h2>
                                            <div className="select-metric">
                                                <div className="filter" onClick={this.openModal}><i
                                                    className="fa fa-filter"></i></div>
                                            </div>
                                            {this.state.monthlyGraphData['nasDailyFB']['currentMonthData']  && this.state.monthlyGraphData['nasDailyFB']['prevMonthData'] ? <div>

                                                <p className="ms-text-dark">{this.state.monthlyGraphData['nasDailyFB']['currentMonthData'].toLocaleString()}</p>
                                                <p className="ms-text-success">{Math.round(((this.state.monthlyGraphData['nasDailyFB']['currentMonthData'] - this.state.monthlyGraphData['nasDailyFB']['prevMonthData']) / this.state.monthlyGraphData['nasDailyFB']['prevMonthData']) * 100)}%</p>
                                                <p>{this.state.monthlyGraphData['nasDailyFB']['prevMonthData'].toLocaleString()} (Prev)</p>
                                            </div> : <div style={{height: "50px"}}></div>}

                                        </div>
                                    </div>
                                    <br/>
                                    <div className="chart">
                                        <FbChart data={this.state.monthlyGraphData['nasDailyFB']['data']}
                                                 labels={this.state.monthlyGraphData['nasDailyFB']['labels']}
                                                 vnData={this.state.monthlyGraphData['nasDailyFBVN']['data']}
                                                 vnLabels={this.state.monthlyGraphData['nasDailyFBVN']['labels']}
                                                 phData={this.state.monthlyGraphData['nasDailyFBPH']['data']}
                                                 phLabels={this.state.monthlyGraphData['nasDailyFBPH']['labels']}
                                                 spData={this.state.monthlyGraphData['nasDailyFBSP']['data']}
                                                 spLabels={this.state.monthlyGraphData['nasDailyFBSP']['labels']}
                                                 thData={this.state.monthlyGraphData['nasDailyFBTH']['data']}
                                                 thLabels={this.state.monthlyGraphData['nasDailyFBTH']['labels']}
                                                 arbData={this.state.monthlyGraphData['nasDailyFBARB']['data']}
                                                 arbLabels={this.state.monthlyGraphData['nasDailyFBARB']['labels']}
                                                 chData={this.state.monthlyGraphData['nasDailyFBCH']['data']}
                                                 chLabels={this.state.monthlyGraphData['nasDailyFBCH']['labels']}
                                        />
                                    </div>
                                </li>
                                <li className="ms-list-item">
                                    <div className="ms-graph-data-div">
                                        <div className="ms-graph-data-title">
                                            <div>
                                                <h2 className="select-metric">{igMetricMap[this.state.igMetric]}</h2>
                                                <Select className="select-container"
                                                        placeholder={this.state.igMetric ? this.state.igMetric : "Select metric"}
                                                        options={igMetricOptions}
                                                        onChange={(value) => this.onSelectIgMetrics(value)}/>
                                            </div>
                                            {this.state.currentMonthIgData ? <div>
                                                <p className="ms-text-dark">{this.state.currentMonthIgData.toLocaleString()}</p>
                                                <p className="ms-text-success">{Math.round(((this.state.currentMonthIgData - this.state.prevMonthIgData) / this.state.prevMonthIgData) * 100)}%</p>
                                                <p>{this.state.prevMonthIgData.toLocaleString()} (Prev)</p>
                                            </div> : <div></div>}
                                        </div>
                                    </div>
                                    <br/>
                                    <div className="chart">
                                        {this.state.monthlyIgGraphData ?
                                            <IgChart data={this.state.monthlyIgGraphData}
                                                     labels={this.state.monthlyIgGraphLabels}
                                            /> : <div></div>
                                        }
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <Modal show={this.state.modalIsOpen} onHide={this.closeModal} animation={false}>
                        <Modal.Body>
                            <div className="date-picker">
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
                            </div>
                            <br/>
                            <br/>
                            <span className="filter-desc">Metrics</span>
                            <div>
                                <Select className=""
                                        placeholder={this.state.metric ? this.state.metric : "Select metric"}
                                        options={metricOptions}
                                        onChange={(value) => this.onSelectMetrics(value, this.state.currentFilterState)}/>
                            </div>
                            <button className="search-btn apply-btn"
                                    onClick={() => this.applyFilter(this.state.startDateFormatted, this.state.endDateFormatted, this.state.metric)}>
                                Apply
                            </button>
                            <button className="search-btn clear-btn" onClick={this.clearFilter}>Clear</button>
                        </Modal.Body>
                    </Modal>
                </div>

            )
        } else {
            return (<Loading/>)
        }

    }

}

export default FacebookInsight