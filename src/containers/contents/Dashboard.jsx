import React, {Component} from 'react'
import ContentWrapper from '../ContentWrapper';

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
                            <div className="dashboard-top">
                                <h2>Welcome to Redeem Admin</h2>
                            </div>
                            <div className="dashboard-body">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ContentWrapper(Dashboard);