import React, {Component} from 'react';
import ContentWrapper from '../ContentWrapper';
import API from '../../services/Services';
import { ContextConsumer } from '../../context/Context';

class PointHistory extends Component {
    state = {
        historyPoint : [],
        historyRedeem : [],
    }


    getHistoryPoint = () => {
        let loginData = this.props.ContextState.loginData;
        let params = {
            appkey : loginData.appkey
        }
        API.getHistoryPoint(params)
        .then((result) => {
            if(result.status){
                let data = result.data;
                this.setState({
                    historyPoint : data
                })
            } else {
                if(result.code === 404){
                    this.setState({
                        historyPoint : [...this.state.historyPoint]
                    })
                } else {
                    console.log(result);
                }
            }
        })
    }

    realTimeUpdate = () => {
        window.setInterval(() => {
            this.getHistoryPoint()    
        }, 1000)
    }

    componentDidMount(){
        document.getElementById('panel-title').innerText = "History Point";
        document.title = "Point History";
        this.getHistoryPoint();
        // this.realTimeUpdate();
    }

    render(){
        return(
            <div className="offer-section">
                <div className="row">
                    <div className="col-12">
                        <div className="history-main card">
                            <div className="history-top mb-3">
                                <button className="btn btn-primary">Filter</button>
                            </div>
                            <div className="history-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered font-sm table-hover">
                                        <thead>
                                            <tr>
                                                <th style={{width : 50, textAlign : "center"}}>#</th>
                                                <th>User</th>
                                                <th style={{width : 150, textAlign : "center"}}>Message</th>
                                                <th style={{width : 150, textAlign : "center"}}>Point</th>
                                                <th style={{width : 250, textAlign : "center"}}>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.historyPoint.length > 0 ?
                                                    this.state.historyPoint.map((value,index) => {
                                                        return(
                                                            <tr key={value.ph_id}>
                                                                <td>{index+1}</td>
                                                                <td>{value.user_fullname}</td>
                                                                <td style={{width : 150, textAlign : "center"}}>{value.ph_name}</td>
                                                                <td style={{width : 150, textAlign : "center"}}>{value.ph_point}</td>
                                                                <td style={{width : 250, textAlign : "center"}}>{value.ph_date}</td>
                                                            </tr>
                                                        )
                                                    })
                                                :
                                                <tr>
                                                    <td style={{textAlign : "center"}} colSpan={5}>No History</td>
                                                </tr>
                                            }
                                        </tbody>

                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default ContentWrapper(ContextConsumer(PointHistory));