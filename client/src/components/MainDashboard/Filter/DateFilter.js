import React from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

class DateFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: new Date(),
            endDate: new Date()
        };

    }

    render() {
        return (
            <div className="date-picker">
                <div className="start-date">
                    <DatePicker
                        selected={this.props.startDate}
                        onChange={this.props.handleStartDateChange}
                    />
                </div>
                <div className="end-date">
                    <DatePicker
                        selected={this.props.endDate}
                        onChange={this.props.handleEndDateChange}
                    />
                </div>
            </div>
        );
    }
}

export default DateFilter