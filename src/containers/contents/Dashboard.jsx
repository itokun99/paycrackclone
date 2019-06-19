import React, {Component} from 'react'
import ContentWrapper from '../ContentWrapper';
import { Link } from 'react-router-dom';
import Icon from 'react-icons-kit';
import {user} from 'react-icons-kit/fa/user';
import {circleO} from 'react-icons-kit/fa/circleO'
import API, {Setting} from '../../services/Services';
import {archive} from 'react-icons-kit/fa/archive'
import {star} from 'react-icons-kit/fa/star'
import {gift} from 'react-icons-kit/fa/gift'
import {spinner} from 'react-icons-kit/fa/spinner'
import {check} from 'react-icons-kit/fa/check'
import {windowRestore} from 'react-icons-kit/fa/windowRestore'

class Dashboard extends Component {
    componentDidMount(){
        document.getElementById('panel-title').innerText = "Dashboard";
        document.title = "Dashboard";
    }

    render(){
        return(
            <div className="dashboard-content">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="dashboard-top mb-4" style={{textAlign : "center"}}>
                                <h2>Welcome to Redeem Admin</h2>
                            </div>
                            <div className="dashboard-body">
                                <div className="row">
                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                        <div className="shortcut">
                                            <Link to={`${Setting.basePath}user`}>
                                                <div className="s-holder">
                                                    <Icon size={56} icon={user} />
                                                </div>
                                                <h4 className="s-title">USER</h4>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                        <div className="shortcut">
                                            <Link to={`${Setting.basePath}point-history`}>
                                                <div className="s-holder">
                                                    <Icon size={56} icon={circleO} />
                                                </div>
                                                <h4 className="s-title">POINT HISTORY</h4>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                        <div className="shortcut">
                                            <Link to={`${Setting.basePath}redeem`}>
                                                <div className="s-holder">
                                                    <Icon size={56} icon={archive} />
                                                </div>
                                                <h4 className="s-title">REDEEM</h4>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                        <div className="shortcut">
                                            <Link to={`${Setting.basePath}jackpot`}>
                                                <div className="s-holder">
                                                    <Icon size={56} icon={star} />
                                                </div>
                                                <h4 className="s-title">JACKPOT</h4>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                        <div className="shortcut">
                                            <Link to={`${Setting.basePath}item`}>
                                                <div className="s-holder">
                                                    <Icon size={56} icon={gift} />
                                                </div>
                                                <h4 className="s-title">ITEM/GIFT</h4>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                        <div className="shortcut">
                                            <Link to={`${Setting.basePath}spinner`}>
                                                <div className="s-holder">
                                                    <Icon size={56} icon={spinner} />
                                                </div>
                                                <h4 className="s-title">SPINNER</h4>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                        <div className="shortcut">
                                            <Link to={`${Setting.basePath}dailypointset`}>
                                                <div className="s-holder">
                                                    <Icon size={56} icon={check} />
                                                </div>
                                                <h4 className="s-title">DAILY POINT</h4>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                        <div className="shortcut">
                                            <Link to={`${Setting.basePath}banner`}>
                                                <div className="s-holder">
                                                    <Icon size={56} icon={windowRestore} />
                                                </div>
                                                <h4 className="s-title">BANNER/ADS</h4>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ContentWrapper(Dashboard);