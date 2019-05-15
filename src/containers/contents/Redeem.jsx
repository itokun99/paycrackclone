import React, {Component} from 'react';
import ContentWrapper from '../ContentWrapper';
import API from '../../services/Services';

class Redeem extends Component {
    state = {
        historyRedeem : [],
    }

    getRedeemHistory = () => {
        API.getHistoryRedeem()
        .then((result) => {
            if(result.status){
                this.setState({
                    historyRedeem : result.data
                })
            } else {
                if(result.code === 404){
                    this.setState({
                        historyRedeem : [...this.state.historyRedeem]
                    })
                } else {
                    console.log(result.message)
                }
            }
        })
    }

    changeStatus = (redeem_id) => {
        let conf = window.confirm("Want to change this redeem status?");
        if(conf){
            let data  =  {
                redeem_id : redeem_id
            };
            API.updateRedeemStatus(data)
            .then((result) => {
                if(result.status){
                    window.alert(result.message);
                    this.getRedeemHistory();
                } else {
                    console.log(result);
                    window.alert(result.message);
                }
            })
        } else {
            return false;
        }
    }

    componentDidMount(){
        document.getElementById('panel-title').innerText = "Redeem List";
        this.getRedeemHistory();
    }

    render(){
        return(
            <div className="offer-section">
                <div className="row">
                    <div className="col-12">
                        <div className="redeem-main card">
                            <div className="redeem-top mb-3">
                                <button className="btn btn-primary">Filter</button>
                            </div>
                            <div className="redeem-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered font-sm table-hover">
                                        <thead>
                                            <tr>
                                                <th style={{width: 50, textAlign: "center"}}>#</th>
                                                <th>User</th>
                                                <th style={{textAlign: "center"}}>Item</th>
                                                <th style={{width: 200, textAlign: "center"}}>Date</th>
                                                <th style={{width: 100, textAlign: "center"}}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.historyRedeem.length > 0 ?
                                                this.state.historyRedeem.map((redeem, index) => {
                                                    return(
                                                        <tr key={redeem.rh_id}>
                                                            <td style={{textAlign: "center"}}>{index+1}</td>
                                                            <td>{redeem.rh_user_name}</td>
                                                            <td style={{textAlign: "center"}}>{redeem.rh_item_name}</td>
                                                            <td style={{textAlign: "center"}}>{redeem.rh_date}</td>
                                                            <td style={{textAlign: "center"}}>{redeem.rh_status === "1" ? "paid" : <button onClick={() => this.changeStatus(redeem.rh_id)} className="btn btn-sm btn-danger">accept</button>}</td>
                                                        </tr>
                                                    )
                                                })
                                                :
                                                <tr>
                                                    <td colSpan={5}>No Redeem Data</td>
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


export default ContentWrapper(Redeem);