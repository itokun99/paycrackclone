import React, {Component} from 'react';
import ContentWrapper from '../ContentWrapper';
import API from '../../services/Services';
import { ContextConsumer } from '../../context/Context';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import moment from 'moment';

let interval = null;
class Redeem extends Component {
    state = {
        historyRedeem : [],
        noLoadData : false,
        limitRecord : 100,
    }

    getRedeemHistory = (offset = this.state.historyRedeem.length , limit = this.state.limitRecord, action = null) => {
        let loginData = this.props.ContextState.loginData;
        let params = {
            appkey : loginData.appkey,
            offset : offset,
            limit : limit
        }
        API.getHistoryRedeem(params)
        .then((result) => {
            if(result.status){
                this.setState({
                    historyRedeem : result.data
                }, action)
            } else {
                if(result.code === 404){
                    this.setState({
                        historyRedeem : [...this.state.historyRedeem],
                        noLoadData : true,
                    }, action)
                } else {
                    console.log(result.message)
                }
            }
        })
    }

    changeStatus = (redeem_id) => {
        let loginData = this.props.ContextState.loginData;
        let conf = window.confirm("Want to change this redeem status?");
        if(conf){
            let data  =  {
                appkey : loginData.appkey,
                redeem_id : redeem_id,
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
        document.title = "Redeem List"
        this.getRedeemHistory();
    }

    render(){
        if(this.state.noLoadData){
            clearInterval(interval);
        }
        const dataTableColumns = [
            { 
                Header : "#",
                sortable : true,
                maxWidth : 50, 
                style : {textAlign : "center"}, 
                Cell: row => (<div>{row.index+1}</div>),
                filterable: false
            },{ 
                Header : "Username", 
                sortable : true, 
                accessor : "rh_user_name", 
                style : {textAlign : "center"}, 
            },{ 
                Header : "Item", 
                sortable : true, 
                accessor : "rh_item_name", 
                style : {textAlign : "center"}, 
            }, { 
                Header : "Status", 
                sortable : true, 
                accessor : "ph_point", 
                style : {textAlign : "center"},
                Cell : row => (<div>{moment(row.original.ph_date).format("DD MMMM YYYY")}</div>) 
            },{ 
                Header : "Status", 
                sortable : true, 
                accessor : "rh_status", 
                style : {textAlign : "center"},
                Cell : row => (<div>{row.original.rh_status === "1" ? "paid" : <button onClick={() => this.changeStatus(row.original.rh_id)} className="btn btn-sm btn-danger">accept</button>}</div>) 
            }
        ];
        return(
            <div className="offer-section">
                <div className="row">
                    <div className="col-12">
                        <div className="redeem-main card">
                            <div className="redeem-top mb-3">
                                {/* <button className="btn btn-primary">Filter</button> */}
                            </div>
                            <div className="redeem-body">
                                {/* <div className="table-responsive">
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
                                                    <td style={{textAlign: "center"}} colSpan={5}>No Redeem Data</td>
                                                </tr>
                                            }
                                        </tbody>
                                    </table>
                                </div> */}
                                <ReactTable
                                    title="User Table"
                                    columns={dataTableColumns}
                                    data={this.state.historyRedeem}
                                    selectableRows = {null}
                                    defaultPageSize = {this.state.historyRedeem.length < 50 ? 20 : 50}
                                    filterable={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default ContentWrapper(ContextConsumer(Redeem));