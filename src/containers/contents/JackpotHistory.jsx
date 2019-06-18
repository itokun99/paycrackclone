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
        historyJackpot : [],
        noLoadData : false,
        limitRecord : 100,
    }

    getJackpotHistory = (offset = this.state.historyRedeem.length , limit = this.state.limitRecord, action = null) => {
        let loginData = this.props.ContextState.loginData;
        let params = {
            appkey : loginData.appkey,
            offset : offset,
            limit : limit
        }
        API.getJackpotHistory(params)
        .then((result) => {
            if(result.status){
                this.setState({
                    historyJackpot : result.data
                }, action)
            } else {
                if(result.code === 404){
                    this.setState({
                        historyJackpot : [...this.state.historyJackpot],
                        noLoadData : true,
                    }, action)
                } else {
                    console.log(result.message)
                }
            }
        })
    }

    changeStatus = (id, status = "0") => {
        let loginData = this.props.ContextState.loginData;
        let conf = window.confirm("Want to change this jackpot status?");
        switch(status){
            case "0":
                    status = "1";
                break;
            case "1":
                    status = "2";
                break;
            default:
                return false;
        }
        if(conf){
            let data  =  {
                appkey : loginData.appkey,
                jackpot_id : id,
                jackpot_status : status
            };
            API.updateJackpotStatus(data)
            .then((result) => {
                if(result.status){
                    window.alert(result.message);
                    this.getJackpotHistory();
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
        document.getElementById('panel-title').innerText = "Jackpot List";
        document.title = "Jackpot List"
        this.getJackpotHistory();
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
                accessor : "user_name", 
                style : {textAlign : "center"}, 
            },{ 
                Header : "Item", 
                sortable : true, 
                accessor : "jackpot_item", 
                style : {textAlign : "center"}, 
            }, { 
                Header : "Date", 
                sortable : true, 
                accessor : "jackpot_date", 
                style : {textAlign : "center"},
                Cell : row => (<div>{moment(row.original.jackpot_date).format("DD MMMM YYYY")}</div>) 
            },{ 
                Header : "Status", 
                sortable : true, 
                accessor : "jackpot_status", 
                style : {textAlign : "center"},
                Cell : row => (<div>{row.original.jackpot_status === "0" ? 
                <button 
                    onClick={() => this.changeStatus(row.original.jackpot_id, row.original.jackpot_status)} 
                    className="btn btn-sm btn-default">accept
                </button> : 
                row.original.jackpot_status === "1" ?
                <button 
                    onClick={() => this.changeStatus(row.original.jackpot_id, row.original.jackpot_status)} 
                    className="btn btn-sm btn-primary">on proccess
                </button>
                : row.original.jackpot_status === "2" ?
                <button 
                    className="btn btn-sm btn-success">success
                </button>
                :
                <button 
                    className="btn btn-sm btn-danger">canceled
                </button>
                }
                </div>) 
            }
        ];
        return(
            <div className="offer-section">
                <div className="row">
                    <div className="col-12">
                        <div className="redeem-main card">
                            <div className="redeem-top mb-3">
                            </div>
                            <div className="redeem-body">
                                <ReactTable
                                    title="User Table"
                                    columns={dataTableColumns}
                                    data={this.state.historyJackpot}
                                    selectableRows = {null}
                                    defaultPageSize = {this.state.historyJackpot.length < 50 ? 20 : 50}
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