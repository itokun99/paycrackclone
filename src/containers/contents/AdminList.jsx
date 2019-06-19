import React, {Component} from 'react';
import ContentWrapper from '../ContentWrapper';
import API, { Setting } from '../../services/Services';
import { ContextConsumer } from '../../context/Context';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import moment from 'moment';

let interval = null;
class AdminList extends Component {
    constructor(props){
        super(props);
        let loginData = this.props.ContextState.loginData
        this.state = {
            admins : [],
            loginData : loginData
        }
    }

    linkTo = (path) => {
        this.props.history.push(`${Setting.basePath}${path}`)
    }

    getList = () => {
        let loginData = this.state.loginData;
        let params = {
            appkey : loginData.appkey
        }
        API.getAdmin(params)
        .then((result) => {
            if(result.status){
                this.setState({
                    admins : result.data
                })
            } else {
                console.log(result.message)
            }
        })
    }

    linkToEdit = (value) => {
        this.props.history.push(`${Setting.basePath}admin/edit/${value.user_id}`, {
            user_data : value,
        })
    }

    deleteUser = (user_id) => {
        let conf = window.confirm("Are you sure want to delete this user?");
        if(conf){
            let loginData = this.props.ContextState.loginData;
            let appkey = loginData.appkey
            API.deleteAdmin(appkey, user_id).then((response) => {
                if(response.status){
                    alert(response.message);
                    this.getList();
                } else {
                    console.log(response);
                    alert(response.message);
                }
            })
        } else {
            return false;
        }
    }

    componentDidMount(){
        document.getElementById('panel-title').innerText = "Admin List";
        document.title = "Admin List"
        this.getList();
    }

    render(){
        let loginData = this.state.loginData
        return(
            <div className="offer-section">
                <div className="row">
                    <div className="col-12">
                        <div className="redeem-main card">
                            <div className="redeem-top mb-3">
                                {
                                    loginData.user_id === "-1" ?
                                        <div>
                                            <button onClick={() => this.linkTo('admin/add')} className="btn btn-primary">Add Admin</button>
                                        </div>
                                    :
                                        null
                                }
                            </div>
                            <div className="redeem-body">
                                <div className="table-responsive">
                                    <table className="table font-sm table-bordered">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Admin Name</th>
                                                <th>Created Date</th>
                                                {
                                                    loginData.user_id === "-1"?
                                                    (
                                                        <th>Action</th>
                                                    )
                                                    :
                                                    null
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.admins.length > 0 ?
                                                this.state.admins.map((value, index) => {
                                                    return(
                                                        <tr>
                                                            <td>{index+1}</td>
                                                            <td>{value.user_name}</td>
                                                            <td>{moment(value.user_created_date).format("DD MMMM YYYY")}</td>
                                                            {
                                                                loginData.user_id ===  "-1"?
                                                                (
                                                                    <td>
                                                                        <div className="action-wrapper" style={{textAlign : "center"}}>
                                                                            <button onClick={() => this.linkToEdit(value)} className="btn btn-default mr-2">Edit</button>
                                                                            {
                                                                                value.user_id !== loginData.user_id ? <button onClick={() => this.deleteUser(value.user_id)} className="btn btn-danger">Delete</button> : null
                                                                            }
                                                                        </div>
                                                                    </td>
                                                                )
                                                                :
                                                                null
                                                            }
                                                        </tr>
                                                    )
                                                })
                                                :
                                                (
                                                    <tr>
                                                        <td>No Data</td>
                                                    </tr>
                                                )
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


export default ContentWrapper(ContextConsumer(AdminList));