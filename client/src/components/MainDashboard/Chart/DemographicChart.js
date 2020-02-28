import React, {Component} from 'react';
import {Bar} from "react-chartjs-2";
import axios from "axios";
import Select from "react-select";

class DemographicChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDemographicData: false,
            currentCountryData: false,
            demographicData: false,
            demographicCountryData: false,
            ageGenderSourceList: {
                'nasDailyFB': 'age_gender_stats_nasDailyFB',
                'nasDailyFBVN': 'age_gender_stats_nasDailyFBVN',
                'nasDailyFBTH': 'age_gender_stats_nasDailyFBTH',
                'nasDailyFBPH': 'age_gender_stats_nasDailyFBPH',
                'nasDailyFBARB': 'age_gender_stats_nasDailyFBARB',
                'nasDailyFBSP': 'age_gender_stats_nasDailyFBSP',
                'nasDailyFBCH': 'age_gender_stats_nasDailyFBCH'
            },
            countrySourceList: {
                'nasDailyFB': 'country_stats_nasDailyFB',
                'nasDailyFBVN': 'country_stats_nasDailyFBVN',
                'nasDailyFBTH': 'country_stats_nasDailyFBTH',
                'nasDailyFBPH': 'country_stats_nasDailyFBPH',
                'nasDailyFBARB': 'country_stats_nasDailyFBARB',
                'nasDailyFBSP': 'country_stats_nasDailyFBSP',
                'nasDailyFBCH': 'country_stats_nasDailyFBCH'
            },
            currentAgeGenderSource: 'nasDailyFB',
            currentCountrySource: 'nasDailyFB',
            month: 'January',
            year: '2020',
            period: 'This month'
        };
        this.selectAgeGenderSource = this.selectAgeGenderSource.bind(this);
        this.selectCountrySource = this.selectCountrySource.bind(this);
        this.loadDemographicData = this.loadDemographicData.bind(this);
    }

    loadDemographicData(month, year) {
        axios.get('https://nasinsightserver.herokuapp.com/api/videos/demographics/' + month + '/' + year + '/1').then((r) =>
            {
                this.setState({
                    demographicData: r.data,
                    currentDemographicData: JSON.parse(r.data[0][this.state.ageGenderSourceList[this.state.currentAgeGenderSource]]),
                    currentCountryData: r.data[0][this.state.countrySourceList[this.state.currentCountrySource]][0]
                })
            }
        )
    }

    selectAgeGenderSource(value) {
        const source = value.value;
        this.setState({
            currentAgeGenderSource: source,
            currentDemographicData: JSON.parse(this.state.demographicData[0][this.state.ageGenderSourceList[source]])
        })
    }

    selectCountrySource(value) {
        const source = value.value;
        console.log(this.state.demographicData[0][this.state.countrySourceList[source]])
        this.setState({
            currentCountrySource: source,
            currentCountryData: this.state.demographicData[0][this.state.countrySourceList[source]][0]
        })
    }

    componentDidMount() {
        this.loadDemographicData(this.state.month, this.state.year)
    }


    shouldComponentUpdate(nextProps, nextState, nextContent) {
        return this.state.demographicData != nextState.demographicData
            || this.state.currentDemographicData != nextState.currentDemographicData
            || this.state.currentCountryData != nextState.currentCountryData;
    }

    render() {
        if(this.state.currentDemographicData) {

            const monthNames = ["January", "February", "March", "April", "May", "Jun",
                "July", "August", "September", "October", "November", "December"];

            const demographicSourceOption = [{"label": "Nas Daily", "value": "nasDailyFB"},
                {"label": "Nas Daily Vietnamese", "value": "nasDailyFBVN"},
                {"label": "Nas Daily Thai", "value": "nasDailyFBTH"},
                {"label": "Nas Daily Arabic", "value": "nasDailyFBARB"},
                {"label": "Nas Daily Spanish", "value": "nasDailyFBSP"},
                {"label": "Nas Daily Chinese", "value": "nasDailyFBCH"},
                {"label": "Nas Daily Tagalog", "value": "nasDailyFBPH"},
            ];

            const timeOptions = [{"label": "This month", "value": monthNames[new Date().getMonth()]}];

            let graphOptions = {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    xAxes: [
                        {
                            gridLines: {
                                color: '#ffffff',
                                borderDash: [1, 3],
                            }
                        }

                    ],
                    yAxes: [
                        {
                            ticks: {
                                callback: function (label, index, labels) {
                                    return label.toLocaleString();
                                }
                            }

                        }
                    ]
                },
                legend: {
                    display: true,
                },
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem, data) {
                            return tooltipItem.yLabel.toLocaleString();
                        }
                    }
                }
            };

            const plugins = [{
                afterDraw: (chartInstance, easing) => {
                    const ctx = chartInstance.chart.ctx;
                }
            }];

            const colorList = ['#C46210', '#2E5894', '#9C2542', '#BF4F51',
            '#A57164', '#58427C', '#4A646C', '#85754E', '#319177', '#0A7E8C',
                '#9C7C38', '#8D4E85', '#8FD400', '#D98695', '#757575', '#0081AB',
                '#A17A74', '#6D9BC3', '#CD607E', '#AD6F69', '#5FA778'];

            const labels = Object.keys(this.state.currentDemographicData);
            const dataSets = [{
                label: 'View Time (Minutes) By Age-Gender',
                backgroundColor: colorList,
                borderColor: colorList,
                borderWidth: 1,
                hoverBackgroundColor: colorList,
                hoverBorderColor: colorList,
                data: Object.values(this.state.currentDemographicData)
            }];

            const graphData = {
                labels: labels,
                datasets: dataSets
            };

            const countryDataSets = [{
                label: 'View Time (Minutes) By Top Countries',
                backgroundColor: colorList,
                borderColor: colorList,
                borderWidth: 1,
                hoverBackgroundColor: colorList,
                hoverBorderColor: colorList,
                data: Object.values(this.state.currentCountryData)
            }];

            const countryGraphData = {
                labels: Object.keys(this.state.currentCountryData),
                datasets: countryDataSets
            };


            return (
                <li className="ms-list-item">
                    <div>
                        <h2 className="select-metric demographic-title">Demographic</h2>
                        <Select className="select-container select-demographic-time"
                                placeholder={this.state.period ? this.state.period : "Select time"}
                                options={timeOptions}/>
                        <Select className="select-container"
                                placeholder={this.state.currentCountrySource ? this.state.currentCountrySource : "Select demographic source"}
                                options={demographicSourceOption}
                                onChange={(value) => this.selectAgeGenderSource(value)}/>
                    </div>

                    <div className="chart">
                        <Bar data={graphData}
                             width={100}
                             height={300}
                             options={graphOptions}
                             plugins={plugins}

                        />
                    </div>

                    <br/>

                    <div>
                        <h2 className="select-metric demographic-title">Demographic</h2>
                        <Select className="select-container select-demographic-time"
                                placeholder={this.state.period ? this.state.period : "Select time"}
                                options={timeOptions}/>
                        <Select className="select-container"
                                placeholder={this.state.currentAgeGenderSource ? this.state.currentAgeGenderSource : "Select demographic source"}
                                options={demographicSourceOption}
                                onChange={(value) => this.selectCountrySource(value)}/>
                    </div>

                    <div className="chart">
                        <Bar data={countryGraphData}
                             width={100}
                             height={300}
                             options={graphOptions}
                             plugins={plugins}

                        />
                    </div>


                </li>
            )
        }

        else {
            return (<div/>)
        }

    }
}

export default DemographicChart;