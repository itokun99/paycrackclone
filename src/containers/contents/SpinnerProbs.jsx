import React, {Component} from 'react';
import ContentWrapper from '../ContentWrapper';
import { ContextConsumer } from '../../context/Context';
import API, { Setting } from '../../services/Services';
import {Link} from 'react-router-dom';
import moment from 'moment';
class SpinnerProbs extends Component {

    state = {
        spinner_probs : []
    }

    getProbData = () => {
        let loginData = this.props.ContextState.loginData
        let params = {
            appkey : loginData.appkey
        };
        API.getSpinnerProbsData(params)
        .then((result) => {
            if(result.status){
                this.setState({
                    spinner_probs : result.data
                })
            } else {
                if(result.code === 404){
                    this.setState({
                        spinner_probs : []
                    })
                }
            }
        })
    }

    componentDidMount(){
        document.getElementById('panel-title').innerText = "Spinner Probablity"
        document.title = "Spinner Probablity";
        this.getProbData();
    }

    render(){
        return(
            <div className="spinner-section">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="spinner-top mb-3">
                                <Link to={`${Setting.basePath}spinner/add`} className="btn btn-primary mr-2">Add Probablity</Link>
                                <button className="btn btn-primary">Filter</button>
                                <Link to={`${Setting.basePath}spinner/setting`} style={{float : "right"}} className="btn btn-primary">Setting</Link>
                            </div>
                            <div className="spinner-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-hover font-sm">
                                        <thead>
                                            <tr>
                                                <th style={{width : 50, textAlign: "center"}}>#</th>
                                                <th style={{width : 150, textAlign: "center"}}>Start Date</th>
                                                <th style={{width : 150, textAlign: "center"}}>End Date</th>
                                                <th>Probablity</th>
                                                <th style={{width : 150, textAlign: "center"}}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.spinner_probs.length > 0 ?
                                                this.state.spinner_probs.map((value, index) => {
                                                    return(
                                                        <tr key={index}>
                                                            <td style={{width : 50, textAlign: "center"}}>{index+1}</td>
                                                            <td style={{width : 150, textAlign: "center"}}>{moment(value.probs_start_date).format('DD MMMM YYYY')}</td>
                                                            <td style={{width : 150, textAlign: "center"}}>{moment(value.probs_end_date).format('DD MMMM YYYY')}</td>
                                                            <td>{value.probs_data}</td>
                                                            <td style={{width : 150, textAlign: "center"}}>{value.probs_status === "1" ? "Active" : "Expired" }</td>
                                                        </tr>
                                                    )
                                                })
                                                :
                                                <></>
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

export default ContentWrapper(ContextConsumer(SpinnerProbs));