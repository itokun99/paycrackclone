import React, {Component} from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import ContextProvider, { ContextConsumer } from '../context/Context';
import Dashboard from '../containers/contents/Dashboard';
import Login from '../containers/contents/Login';
import PointHistory from '../containers/contents/PointHistory';
import Users from '../containers/contents/Users';
import Items from '../containers/contents/Items';
import SettingPage from '../containers/contents/Setting';
import UserAdd from '../containers/contents/UserAdd';
import UserEdit from '../containers/contents/UserEdit';
import Redeem from '../containers/contents/Redeem';
import { Setting as Config} from '../services/Services';

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
                        <Route path ={`${Config.basePath}`} component={Dashboard} exact />
                        <Route path ={`${Config.basePath}point-history`} exact component={PointHistory} />
                        <Route path ={`${Config.basePath}redeem`} exact component={Redeem} />
                        <Route path ={`${Config.basePath}user`} exact component={Users} /> 
                        <Route path ={`${Config.basePath}user/add`} exact component={UserAdd} /> 
                        <Route path ={`${Config.basePath}user/edit/:id`} exact component={UserEdit} /> 
                        <Route path ={`${Config.basePath}item`} exact component={Items} />
                        <Route path ={`${Config.basePath}setting`} exact component={SettingPage} />
                    </>
                :
                    <>
                        <Route path =  {`${Config.basePath}`} component={Login} exact /> 
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