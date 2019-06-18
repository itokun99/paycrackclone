import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
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
import SpinnnerSetting from '../containers/contents/SpinnnerSetting';
import SpinnerProbs from '../containers/contents/SpinnerProbs';
import SpinnerAdd from '../containers/contents/SpinnerAdd';
import DailyCheckSetting from '../containers/contents/DailyCheckSetting';
import Banner from '../containers/contents/Banner';
import SpinnerEdit from '../containers/contents/SpinnerEdit';
import JackpotHistory from '../containers/contents/JackpotHistory';
import AdminList from '../containers/contents/AdminList';
import AdminAdd from '../containers/contents/AdminAdd';

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
                        <Route path ={`${Config.basePath}jackpot`} exact component={JackpotHistory} />
                        <Route path ={`${Config.basePath}user`} exact component={Users} /> 
                        <Route path ={`${Config.basePath}user/add`} exact component={UserAdd} /> 
                        <Route path ={`${Config.basePath}user/edit/:id`} exact component={UserEdit} /> 
                        <Route path ={`${Config.basePath}item`} exact component={Items} />
                        <Route path ={`${Config.basePath}spinner`} exact component={SpinnerProbs} />
                        <Route path ={`${Config.basePath}spinner/add`} exact component={SpinnerAdd} />
                        <Route path ={`${Config.basePath}spinner/edit/:id`} exact component={SpinnerEdit} />
                        <Route path ={`${Config.basePath}spinner/setting`} exact component={SpinnnerSetting} />
                        <Route path ={`${Config.basePath}dailypointset`} exact component={DailyCheckSetting} />
                        <Route path ={`${Config.basePath}setting`} exact component={SettingPage} />
                        <Route path ={`${Config.basePath}banner`} exact component={Banner} />
                        <Route path ={`${Config.basePath}admin`} exact component={AdminList} />
                        <Route path ={`${Config.basePath}admin/add`} exact component={AdminAdd} />
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