import React, {Component} from 'react';
import ContentWrapper from '../ContentWrapper';
import UserTable from '../../components/UserTable';
import API from '../../services/Services';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import Modal from '../../components/Modal';
import { Icon } from 'react-icons-kit';
import {plus} from 'react-icons-kit/icomoon/plus';

class Users extends Component {
    state = {
        users : [],
        user: {},
        tableIsLoading : true,
        previewMode : false,
        showModal : false,
        addPointMode : false,
        pointData : {
            user_id : "",
            add_point : 0,
        },
        importExcelMode : false,
        importExcel : {
            excel_file : "",
            excel_name : "",
        }
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
        let noValue = false;
        for(let key in excelData){
            if(excelData[key] === ""){
                noValue = true;
            }
        }

        if(noValue){
            window.alert("No file inserted!");
        } else {
            let formData = new FormData();
            formData.append('excel_name', excelData.excel_name);
            formData.append('excel_file', excelData.excel_file);
            API.userImportExcel(formData)
            .then((response) => {
                // console.log(response);
                if(response.status){
                    alert(response.message);
                    this.getUser();
                } else {
                    console.log(response);
                    alert(response.message);
                    this.getUser();
                }
            })
        }
    }

    openModal = () => {
        this.setState({
            showModal : true,
        })
    }

    previewUser = (user) => {
        this.setState({
            previewMode : true,
            user : user
        }, () => {
            this.openModal();
        })
    } 

    getUser = () => {
        API.getUsers()
        .then((response) => {
            if(response.status){
                let users =  response.data;
                this.setState({
                    users : users
                })
            } else {
                if(response.code === 404){
                    this.setState({
                        users : [...this.state.users]
                    })
                } else {
                    console.log(response)
                }
            }
        })
    }

    sendEditData = (user) => {
        let user_id = user.user_id
        this.props.history.push(`/user/edit/${user_id}`, {
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
                importExcel.excel_file  = input.target.files[0];
                importExcel.excel_name  = input.target.files[0].name;
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
            API.deleteUser(user_id).then((response) => {
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
            API.addPoint(pointData)
            .then((response) => {
                if(response.status){
                    alert(response.message);
                    API.getUsers({
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
                                this.getUser();
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
        document.getElementById('panel-title').innerText = "Users List";
        this.getUser();
    }
    render(){
        // console.log(typeof(this.state.user))
        return(
            <>
                <div className="offer-section">
                    <div className="row">
                        <div className="col-12">
                            <div className="offer-main card">
                                
                                <div className="offer-header pb-3">
                                    <Link to="/user/add" className="btn btn-primary mr-2">Add User</Link>
                                    <button onClick={this.handleOpenImportExcel} className="btn btn-primary">Upload Excel</button>
                                </div>

                                <div className="offer-body">
                                    <div className="table-responsive">
                                        <UserTable preview={(user) => this.previewUser(user)} data={this.state.users} />
                                    </div>
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
                                            <td style={{width: 150}}>Nama</td>
                                            <td>{this.state.user.user_fullname}</td>
                                        </tr>
                                        <tr>
                                            <td>Username</td>
                                            <td>{this.state.user.user_name}</td>
                                        </tr>
                                        <tr>
                                            <td>Referral Code</td>
                                            <td>{this.state.user.user_referral_code}</td>
                                        </tr>
                                        <tr>
                                            <td>Email</td>
                                            <td>{this.state.user.user_email}</td>
                                        </tr>
                                        <tr>
                                            <td>Point</td>
                                            <td>{this.state.user.user_point} <button onClick={this.handlePlusPointButton} style={{float: "right"}} className="btn btn-primary btn-sm"><Icon size={12} icon={plus}></Icon></button></td>
                                        </tr>
                                        {
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
                                        }
                                        <tr>
                                            <td>Created Date</td>
                                            <td>{this.state.user.user_created_date}</td>
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
                            <button onClick={this.importExcel} className="btn btn-primary btn-sm mr-2">Submit</button>
                            <button onClick={this.closeModal} className="btn btn-secondary btn-sm">Cancel</button>
                        </div>
                    </Modal>
                    :
                    ""
                }
                
                
            </>
        )
    }
}


export default ContentWrapper(Users);