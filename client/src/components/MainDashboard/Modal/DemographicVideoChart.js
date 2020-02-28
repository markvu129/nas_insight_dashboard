import React, {Component} from 'react';
import {Bar} from "react-chartjs-2";
import "react-animated-slider/build/horizontal.css";

class DemographicVideoChart extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {}

    render(){

        const that = this;

        const graphOptions = {
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
                                return that.props.period === 'ms' ? Math.round(label/60000).toLocaleString() : label.toLocaleString();
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
                        return that.props.period === 'ms' ? Math.round(tooltipItem.yLabel/60000).toLocaleString() : tooltipItem.yLabel.toLocaleString();
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
            '#A17A74', '#6D9BC3', '#CD607E', '#AD6F69', '#5FA778' ];

        const labels = Object.keys(this.props.data);
        const dataSets = [{
            label: this.props.label,
            backgroundColor: colorList,
            borderColor: colorList,
            borderWidth: 1,
            hoverBackgroundColor: colorList,
            hoverBorderColor: colorList,
            data: Object.values(this.props.data)
        }];

        const graphData = {
            labels: labels,
            datasets: dataSets
        };

        return (
            <div>
                <div className="chart">
                    <Bar data={graphData}
                         width={100}
                         height={300}
                         options={graphOptions}
                         plugins={plugins}
                    />
                </div>
            </div>
        )
    }

}

export default DemographicVideoChart;