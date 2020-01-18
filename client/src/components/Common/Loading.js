import React, {Component} from 'react';
import './css/Loading.css';

const Loading = props => (
    <div class="container loading">
        <div className="loading-dots">
            <div className="loading-dots--dot"></div>
            <div className="loading-dots--dot"></div>
            <div className="loading-dots--dot"></div>
        </div>
    </div>
)

export default Loading;