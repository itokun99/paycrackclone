import React, {Component} from 'react';
import ContentWrapper from '../ContentWrapper';
import UserTable from '../../components/UserTable';
// import ReactTable from 'react-table';
import 'react-table/react-table.css'
import API, { Setting as Config } from '../../services/Services';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import Modal from '../../components/Modal';
import { Icon } from 'react-icons-kit';
import {plus} from 'react-icons-kit/icomoon/plus';
import { ContextConsumer } from '../../context/Context';
import UserDataTable from '../../components/UserDataTable';

let interval = null;

class Users extends Component {
    state = {
        users : [],
        activeRecord : [],
        countRecord : 0,
        indexRecord : 0,
        totalRecord : 50,
        limitRecord : 50,
        nextRecord : true,
        loadData : true,
        tableIndex : 0,
        user: {},
        noLoadData : false,
        tableIsLoading : true,
        previewMode : false,
        showModal : false,
        addPointMode : false,
        searchMode : false,
        usersBySearch : [],
        pointData : {
            user_id : "",
            add_point : 0,
        },
        importExcelMode : false,
        importExcel : {
            excel_file : "",
            excel_name : "",
        },
        excel_loading : false,
    }
    
    closeModal = () => {
        this.setState({
            showModal : false,
            user : {},
            previewMode : false,
            importExcelMode : false,
            addPointMode : false,
            pointData : {
                user_id : "",
                add_point : 0,
            },
            importExcel : {
                excel_file : "",
                excel_name : "",
            }
        })
    }

    handleOpenImportExcel = () => {
        this.setState({
            importExcelMode : true,
        },() => {
            this.openModal()
        })
    }

    importExcel = () => {
        let excelData = {...this.state.importExcel};
        let loginData = this.props.ContextState.loginData;
        let noValue = false;
        for(let key in excelData){
            if(excelData[key] === ""){
                noValue = true;
            }
        }

        if(noValue){
            window.alert("No file inserted!");
        } else {
            this.setState({
                excel_loading : true,
            }, () => {
                let formData = new FormData();
                formData.append('appkey', loginData.appkey);
                formData.append('excel_name', excelData.excel_name);
                formData.append('excel_file', excelData.excel_file);
                API.userImportExcel(formData)
                .then((response) => {
                    if(response.status){
                        alert(response.message);
                        this.setState({
                            excel_loading : false,
                        }, () => {
                            let limit = this.state.users.length;
                            this.setState({
                                users : [],
                                limitRecord : limit < 100 ? limit : 100,
                                activeRecord : [],
                                countRecord : 0,
                                indexRecord : 0,
                                totalRecord : 10,
                            }, () => {
                                this.getUser()    
                            })
                            this.getUser();
                            this.closeModal();  
                        })
                    } else {
                        console.log(response);
                        alert(response.message);
                        this.getUser();
                    }
                })
            })
        }
    }

    openModal = () => {
        this.setState({
            showModal : true,
        })
    }

    previewUser = (user) => {
        console.log('dwadw');
        this.setState({
            previewMode : true,
            user : user
        }, () => {
            this.openModal();
        })
    }
    getUser = (offset = this.state.users.length, limit = this.state.limitRecord, action = null) => {
        let loginData = this.props.ContextState.loginData;
        let users_data = [...this.state.users]
        let params = {
            appkey : loginData.appkey,
            limit : limit,
            offset : offset
        }
        API.getUsers(params)
        .then((response) => {
            if(response.status){
                let users =  response.data;
                if(this.mounted){
                    this.setState({
                        users : [...users_data,...users],
                        loadData : true
                    }, action)
                }
            } else {
                if(response.code === 404){
                    if(this.mounted){
                        this.setState({
                            users : [...this.state.users],
                            loadData : false,
                            noLoadData : true,
                        }, action)
                    }
                } else {
                    console.log(response)
                }
            }
        })
    }
    
    sendEditData = (user) => {
        let user_id = user.user_id
        this.props.history.push(`${Config.basePath}user/edit/${user_id}`, {
            user_data : user
        })
    }

    handleChangeInput = (input) => {
        let pointData = {...this.state.pointData}
        let importExcel = {...this.state.importExcel}
        let name = input.target.name;
        switch(name){
            case "add_point":
                pointData.add_point = input.target.value;
                break;
            case "excel_file":
                importExcel.excel_file = input.target.files[0];
                importExcel.excel_name = input.target.files[0].name;
                break;
            default:
                return false;
        }

        this.setState({
            pointData : pointData,
            importExcel : importExcel
        }, () => {
            console.log(this.state.importExcel);
        })
    }

    deleteUser = (user_id) => {
        let conf = window.confirm("Are you sure want to delete this user?");
        if(conf){
            let loginData = this.props.ContextState.loginData;
            let appkey = loginData.appkey
            API.deleteUser(appkey, user_id).then((response) => {
                if(response.status){
                    alert(response.message);
                    this.getUser();
                    this.closeModal();
                } else {
                    console.log(response);
                    alert(response.message);
                }
            })
        } else {
            return false;
        }
    }

    handlePlusPointButton = () => {
        let user = {...this.state.user}
        let pointData = {...this.state.pointData}
        pointData.user_id = user.user_id;
        this.setState({
            addPointMode : !this.state.addPointMode,
            pointData : pointData
        })
    }

    handleSubmitPointBtn = () => {
        let pointData = {...this.state.pointData};
        let noValue = false;
        for(let key in pointData){
            if(pointData[key] === ""){
                noValue = true
            }
        }
        if(noValue){
            alert("Point harus diisi");
        } else {
            let loginData = this.props.ContextState.loginData;
            pointData.appkey = loginData.appkey;
            API.addPoint(pointData)
            .then((response) => {
                if(response.status){
                    alert(response.message);
                    API.getUsers({
                        appkey : loginData.appkey,
                        id : pointData.user_id
                    }).then((response) => {
                        if(response.message){
                            let data = response.data[0]
                            this.setState({
                                user : data,
                                addPointMode : false,
                                pointData : {
                                    user_id : "",
                                    add_point : 0,
                                }
                            }, () => {
                                let users = this.state.users;
                                users.map((value, index) => {
                                    if(value.user_id === data.user_id ){
                                        users[index] = data 
                                    }
                                    return true; 
                                })
                                this.setState({
                                    users : users, 
                                })
                            })
                        } else {
                            console.log(response);
                            alert(response.message);
                        }
                    })
                } else {
                    console.log(response)
                    alert(response.message);
                }
            })
        }
    }

    componentDidMount(){
        this.mounted = true;
        document.getElementById('panel-title').innerText = "Users List";
        document.title = "User List";
        
        this.getUser(this.state.users.length, this.state.limitRecord, () => {
            interval = setInterval(() => {
                console.log("Load data")
                this.getUser();
            }, 1000);
        })
    }

    componentWillMount(){
        this.mounted = false;
        clearInterval(interval);

    }

    render(){
        if(this.state.noLoadData){
            clearInterval(interval)   
        }
        return(
            <>
                <div className="offer-section">
                    <div className="row">
                        <div className="col-12">
                            <div className="offer-main card">
                                
                                <div className="offer-header">
                                    <div className="row justify-content-between">
                                        <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                            <div className="pb-2">
                                                <Link to={`${Config.basePath}user/add`} className="btn btn-primary mr-2">Add User</Link>
                                                <button onClick={this.handleOpenImportExcel} className="btn btn-primary">Upload Excel</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="offer-body">
                                    <UserDataTable previewUser={(user) => this.previewUser(user)} data={this.state.users} />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.state.showModal && this.state.previewMode ?
                    <Modal>
                        <div className="modal-header">
                            <h4 className="modal-title">Detail</h4>
                            <span onClick={this.closeModal} className="modal-close">&times;</span>
                        </div>
                        <div className="modal-body">
                            <div className="table-responsive">
                                <table className="table table-bordered font-sm">
                                    <tbody>
                                        <tr>
                                            <td style={{width: 150}}>ID</td>
                                            <td>{this.state.user.user_id}</td>
                                        </tr>
                                        <tr>
                                            <td style={{width: 150}}>Nama</td>
                                            <td>{this.state.user.user_fullname}</td>
                                        </tr>
                                        <tr>
                                            <td>Username</td>
                                            <td><strong>{this.state.user.user_name}</strong></td>
                                        </tr>
                                        <tr>
                                            <td>Point</td>
                                            <td>{this.state.user.user_point}
                                            {/* <button onClick={this.handlePlusPointButton} style={{float: "right"}} className="btn btn-primary btn-sm"><Icon size={12} icon={plus}></Icon></button> */}
                                            </td>
                                        </tr>
                                        {/* {
                                            this.state.addPointMode ?
                                            <tr>
                                                <td colSpan={2}>
                                                    <div style={{display:"flex"}}>
                                                        <input onChange={(e) => this.handleChangeInput(e)} type="number" className="form-control" name="add_point" /><button onClick={this.handleSubmitPointBtn} className="ml-2 btn btn-primary btn-sm">submit</button>
                                                    </div>
                                                </td>
                                            </tr>
                                            :
                                            <></>
                                        } */}
                                        <tr>
                                            <td>Created Date</td>
                                            <td>{this.state.user.user_created_date}</td>
                                        </tr>

                                        <tr>
                                            <td>Address</td>
                                            <td>{this.state.user.user_address === "" ? "(not inserted)" : this.state.user.user_address }</td>
                                        </tr>
                                        <tr>
                                            <td>Status</td>
                                            <td>{this.state.user.user_status === "1" ? "Active" : "Deactive" }</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick = {() => this.sendEditData(this.state.user)} className="btn btn-primary mr-2">Edit</button>
                            <button onClick= {() => this.deleteUser(this.state.user.user_id)} className="btn btn-danger">delete</button>
                        </div>
                    </Modal>
                    : 
                    ""
                }
                {
                    this.state.showModal && this.state.importExcelMode ? 
                    <Modal size="small">
                        <div className="modal-header">
                            <h4 className="modal-title">Import Excel</h4>
                            <span  onClick={this.closeModal} className="modal-close">&times;</span>
                        </div>
                        <div className="modal-body">
                            <div className="import-excel-form">
                                <div className="import-wrapper">
                                    <input onChange={(e) => this.handleChangeInput(e)} name="excel_file" type="file" accept=".xls,.xlsx,.odx" className="import-input" />
                                    <span>{this.state.importExcel.excel_name === "" ? "Choose File" : this.state.importExcel.excel_name}</span>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            {this.state.excel_loading ? <button className="btn btn-secondary btn-sm mr-2">Loading</button> : <button onClick={this.importExcel} className="btn btn-primary btn-sm mr-2">Submit</button>}
                            {this.state.excel_loading ? null : <button onClick={this.closeModal} className="btn btn-secondary btn-sm">Cancel</button>}
                        </div>
                    </Modal>
                    :
                    ""
                }
                
                
            </>
        )
    }
}


export default ContentWrapper(ContextConsumer(Users));