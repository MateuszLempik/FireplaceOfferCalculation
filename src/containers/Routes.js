import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import asyncComponent from '../hoc/asyncComponent';

import CalculateMain from './CalculateMain/CalculateMain';

const AsyncCalculatePrice = asyncComponent(() => {
    return import('./CalculatePrice/CalculatePrice'); 
}); 

const AsyncCalculateSummary = asyncComponent(() => {
    return import('./CalculateSummary/CalculateSummary'); 
}); 

const AsyncAllCalculations = asyncComponent(() => {
    return import('./AllCalculations/AllCalculations'); 
}); 

class Routes extends Component {
    render () {
        return(
            <>
                <Switch>
                    <Route path="/calculateMain" component={CalculateMain} />
                    <Route path="/calculatePrice" component={AsyncCalculatePrice} />
                    <Route path="/calculateSummary" component={AsyncCalculateSummary} />
                    <Route path="/allCalculations" component={AsyncAllCalculations} />
                    <Redirect from="/" to="/calculateMain" />
                </Switch>
            </>
        );
    }

}

export default Routes;

