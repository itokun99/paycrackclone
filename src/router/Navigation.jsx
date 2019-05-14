import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import ContextProvider, { ContextConsumer } from '../context/Context';
import Dashboard from '../containers/contents/Dashboard';
import Login from '../containers/contents/Login';
import PointHistory from '../containers/contents/PointHistory';
import Users from '../containers/contents/Users';
import Items from '../containers/contents/Items';
import Setting from '../containers/contents/Setting';
import UserAdd from '../containers/contents/UserAdd';
import UserEdit from '../containers/contents/UserEdit';
import Redeem from '../containers/contents/Redeem';

const RouterWrapper = (Navigation) => {
    return(
        class Router extends Component {
            render(){
                return(
                    <BrowserRouter>
                        <Navigation {...this.props} />
                    </BrowserRouter>
                )
            }
        }
    )
}


const Navigation = (props) => {
    return(
        <Switch>
            {
                props.ContextState.isLogin ? 
                    <>  
                        <Route path =  "/" component={Dashboard} exact />
                        <Route path =  "/point-history" component={PointHistory} exact />
                        <Route path =  "/redeem" component={Redeem} exact />
                        <Route path =  "/user" component={Users} exact /> 
                        <Route path =  "/user/add" component={UserAdd} exact /> 
                        <Route path =  "/user/edit/:id" component={UserEdit} exact /> 
                        <Route path =  "/item" component={Items} exact />
                        <Route path =  "/setting" component={Setting} exact />
                    </>
                :
                    <>
                        <Route path =  "/" component={Login} exact /> 
                    </>
            }
        </Switch>
    )
}


export default
ContextProvider(
    RouterWrapper(
        ContextConsumer(
            Navigation
        )
    )
);