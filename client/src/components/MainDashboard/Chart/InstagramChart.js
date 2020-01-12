import React, {Component} from 'react';
import {Line} from "react-chartjs-2";

class IgChart extends Component {
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
                        label: 'NasDaily IG',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: '#ea5b81',
                        borderColor: '#ea5b81',
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

export default IgChart;