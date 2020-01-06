import React from 'react';
import {render} from 'react-dom';
import {Route, Router, Switch} from 'react-router-dom';
import App from './components/App/App';
import Overview from './components/MainDashboard/Overview';
import './styles/main.css';
import history from "./modules/history.js";

render((
    <Router history={history}>
        <App>
            <Switch>
                <Route exact path="/" component={Overview}/>
                <Route exact path="/home" component={Overview}/>
            </Switch>
        </App>
    </Router>
), document.getElementById('app'));
