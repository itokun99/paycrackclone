import React, {Component} from 'react';
import ContentWrapper from '../ContentWrapper';
import API from '../../services/Services';
import { ContextConsumer } from '../../context/Context';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import moment from 'moment';

let interval = null;

class PointHistory extends Component {
    state = {
        historyPoint : [],
        historyRedeem : [],
        searchData : [],
        searchMode : false,
        activeRecord : [],
        countRecord : 0,
        indexRecord : 0,
        totalRecord : 20,
        limitRecord : 60,
        noLoadData : false,
        inputSearch : "",
    }


    getHistoryPoint = (offset = this.state.historyPoint.length, limit = this.state.limitRecord, action = null) => {
        let loginData = this.props.ContextState.loginData;
        let historyPoint_data = [...this.state.historyPoint];
        let params = {
            appkey : loginData.appkey,
            limit : limit,
            offset : offset
        }
        API.getHistoryPoint(params)
        .then((result) => {
            if(result.status){
                let data = result.data;
                this.setState({
                    historyPoint : [...historyPoint_data, ...data ]
                }, action)
            } else {
                if(result.code === 404){
                    this.setState({
                        historyPoint : [...this.state.historyPoint],
                        noLoadData : true,
                    }, action)
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

    handleSearch = (input) => {
        let inputText = input.target.value;
        if(inputText !== ""){
            let resultSearch = [];
            let historyPoint = [...this.state.historyPoint];
            historyPoint.forEach((value) => {
                let searchResultUsername = value.user_fullname.toLowerCase().indexOf(inputText.toLowerCase());
                let searchResultPoin = value.ph_point.toLowerCase().indexOf(inputText.toLowerCase());
                let searchResultDate = value.ph_date.toLowerCase().indexOf(inputText.toLowerCase());
                
                if(searchResultUsername !== -1 && searchResultUsername !== "undefined"){
                    resultSearch.push(value)
                } else if(searchResultPoin !== -1 && searchResultPoin !== "undefined"){
                    resultSearch.push(value)
                } else if(searchResultDate !== -1 && searchResultDate !== "undefined"){
                    resultSearch.push(value)
                }
            })
            this.setState({
                searchData : resultSearch,
                searchMode : true,
            }, () => {
                if(inputText.length > 2){
                    this.getHistoryPoint(historyPoint.length, 300);
                }
                if(resultSearch.length === 0){
                    historyPoint.forEach((value) => {
                        let searchResultUsername = value.user_fullname.toLowerCase().indexOf(inputText.toLowerCase());
                        let searchResultPoin = value.ph_point.toLowerCase().indexOf(inputText.toLowerCase());
                        let searchResultDate = value.ph_date.toLowerCase().indexOf(inputText.toLowerCase());
                        
                        if(searchResultUsername !== -1 && searchResultUsername !== "undefined"){
                            resultSearch.push(value)
                        } else if(searchResultPoin !== -1 && searchResultPoin !== "undefined"){
                            resultSearch.push(value)
                        } else if(searchResultDate !== -1 && searchResultDate !== "undefined"){
                            resultSearch.push(value)
                        }
                    })

                    this.setState({
                        usersBySearch : resultSearch,
                        searchMode : true,
                    })
                }
            })
        } else {
            this.setState({
                searchData : [],
                searchMode : false,
            })
        }
    }

    componentDidMount(){
        document.getElementById('panel-title').innerText = "History Point";
        document.title = "Point History";

        // this.getHistoryPoint(this.state.historyPoint.length, this.state.limitRecord, () => {
        //     interval = setInterval(() => {
        //         this.getHistoryPoint()
        //     }, 1000)
        // });
        // this.realTimeUpdate();
    }

    handleSearch = (input) => {
        let inputSearch = this.state.inputSearch;
        let value = input.target.value;
        this.setState({
            inputSearch : value
        },() => {
            console.log(this.state.inputSearch)
        })
    }

    submitSearch = () => {
        let loginData = this.props.ContextState.loginData;
        let params = {
            appkey : loginData.appkey,
            search : this.state.inputSearch
        }
        API.searchPointHistory(params)
        .then((result) => {
            console.log(result)
            if(result.status){
                let data = result.data;
                this.setState({
                    historyPoint : [...data]
                })
            } else {
                if(result.code === 404){
                    this.setState({
                        historyPoint : [],
                    }, () => {
                        window.alert(result.message)
                    })
                } else {
                    console.log(result);
                    window.alert(result.message)
                }
            }
        })
    }

    render(){
        if(this.state.noLoadData){
            // console.log('dawawd')
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
                Header : "Message", 
                sortable : true, 
                accessor : "ph_name", 
                style : {textAlign : "center"}, 
            },{ 
                Header : "Point", 
                sortable : true, 
                accessor : "ph_point", 
                style : {textAlign : "center"}, 
            },{ 
                Header : "Date", 
                sortable : true, 
                accessor : "ph_point", 
                style : {textAlign : "center"},
                Cell : row => (<div>{moment(row.original.ph_date).format("DD MMMM YYYY")}</div>) 
            }
        ];
        
        return(
            <div className="offer-section">
                <div className="row">
                    <div className="col-12">
                        <div className="history-main card">
                            <div className="history-top">
                                <div className="row">
                                    <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                        <div className="form-group row mb-4">
                                            <div className="col-8">
                                                <input type="text" onChange={(e) => this.handleSearch(e)} className="form-control" name="searchInput" placeholder="Search.." />
                                            </div>
                                            <div className="col-4">
                                                <button onClick={this.submitSearch} className="btn btn-primary">Search</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="history-body">
                                <ReactTable
                                    title="User Table"
                                    columns={dataTableColumns}
                                    data={this.state.historyPoint}
                                    selectableRows = {null}
                                    defaultPageSize = {this.state.historyPoint.length < 20 ? 20 : 50}
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


export default ContentWrapper(ContextConsumer(PointHistory));