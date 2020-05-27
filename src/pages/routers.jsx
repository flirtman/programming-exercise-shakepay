import React from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";


import Home from './home';

export default function Routers() {
    return (
        <Router>
            <div>
                <Switch>
                    <Route path={"/"}>
                        <Home/>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}