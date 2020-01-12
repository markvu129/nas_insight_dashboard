import React, {Component} from 'react';
import {Line} from "react-chartjs-2";

class FbChart extends Component {
    constructor(props) {
        super(props);
    }
    shouldComponentUpdate(nextProps, nextState, nextContent) {
        return this.props.data != nextProps.data;
    }

    render() {
        if (this.props.labels.length > 0 && this.props.data.length > 0) {
            const data = {
                labels: this.props.labels,
                datasets: [
                    {
                        label: 'NasDaily',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: '#6a8cd1',
                        borderColor: '#6a8cd1',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: '#fff',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: '#2F323B',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: this.props.data
                    },
                    {
                        label: 'NasDailyVN',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: '#DA332E',
                        borderColor: '#DA332E',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: '#fff',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: '#2F323B',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: this.props.vnData
                    },
                    {
                        label: 'NasDailyPH',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: '#3b7464',
                        borderColor: '#3b7464',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: '#fff',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: '#2F323B',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: this.props.phData
                    },
                    {
                        label: 'NasDailySP',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: '#FACF48',
                        borderColor: '#FACF48',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: '#fff',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: '#2F323B',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: this.props.spData
                    },
                    {
                        label: 'NasDailyTH',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: '#9f3db6',
                        borderColor: '#9f3db6',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: '#fff',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: '#2F323B',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: this.props.thData
                    },
                    {
                        label: 'NasDailyARB',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: '#41d4ea',
                        borderColor: '#41d4ea',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: '#fff',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: '#2F323B',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: this.props.arbData
                    },
                    {
                        label: 'NasDailyCN',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: '#d68215',
                        borderColor: '#d68215',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: '#fff',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: '#2F323B',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: this.props.chData
                    }
                ]
            };

            const options = {
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
                            gridLines: {
                                color: '#ffffff',
                                borderDash: [1, 3],
                            },
                            ticks: {
                                callback: function(label, index, labels) {
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
                        label: function(tooltipItem, data) {
                            return tooltipItem.yLabel.toLocaleString();
                        }
                    }
                }
            };

            return (
                <div>
                    <Line data={data} options={options} width="400" height="200"/>
                </div>
            )
        } else {
            return (<div></div>)
        }
    }

}

export default FbChart;