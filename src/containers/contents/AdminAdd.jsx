import React, {Component} from 'react';
import ContentWrapper from '../ContentWrapper';
import API, {Setting as Config} from '../../services/Services';
import { ContextConsumer } from '../../context/Context';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import moment from 'moment';
import { Link } from 'react-router-dom/cjs/react-router-dom';

let interval = null;
class AdminAdd extends Component {
    
    constructor(props){
        super(props);
        let loginData = this.props.ContextState.loginData
        this.state = {
            loginData : loginData,
            admin : {
                user_name : "",
                user_fullname : "",
                user_password : "",
                user_verify_password : "",
            },
            matchPassword : true,
        }
    }

    saveUser = () => {
        let loginData = this.props.ContextState.loginData;
        let user = {...this.state.admin};
        let noValue = false;
        for(let key in user){
            if(user[key] === "" ){
                noValue = true
            }
        }
        if(noValue){
            alert("Please fill the form correctly!");
        } else {
            user.appkey = loginData.appkey;
            API.createAdmin(user)
            .then((response) => {
                if(response.status){
                    alert(response.message);
                    this.props.history.push(`${Config.basePath}user`);
                } else {
                    alert(response.message);
                    console.log(response);
                }
            })
        }
    }

    handleChangeText = (input, name) => {
        let admin  = this.state.admin;
        let value = input.target.value;
        let matchPassword = true;
        switch(name){
            case "fullname":
                admin.user_fullname = value
                break;
            case "username":
                admin.user_name = value
                break;
            case "password":
                admin.user_password = value
                break;
            case "verify_password":
                admin.user_verify_password = value
                break;
            default:
                return false;
        }

        if(admin.user_password !== admin.user_verify_password){
            matchPassword = false;
        }

        this.setState({
            admin : admin,
            matchPassword : matchPassword
        })
    }

    

    componentDidMount(){
        document.getElementById('panel-title').innerText = "Jackpot List";
        document.title = "Jackpot List"
    }

    render(){
        let loginData = this.state.loginData
        return(
            <div className="offer-section">
                <div className="row">
                    <div className="col-12">
                        <div className="redeem-main card">
                            <div className="redeem-body">
                                <div className="row justify-content-center">
                                    <div className="col-12 col-sm-12 col-md-8 col-lg-8">
                                        <div className="form-group">
                                            <h3>Add Admin</h3>
                                        </div>
                                        <div className='form-group row'>
                                            <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Fullname</label>
                                            <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                                <input className="form-control" onChange={(e) => this.handleChangeText(e,'fullname')} type="text" placeholder="Fullname" />
                                            </div>
                                        </div>
                                        <div className='form-group row'>
                                            <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Username</label>
                                            <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                                <input className="form-control" onChange={(e) => this.handleChangeText(e,'username')} type="text" placeholder="Username" />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Password</label>
                                            <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                                <input onChange={(e) => this.handleChangeText(e,'password')} name="user_password" className="form-control" type="password" placeholder="******" />
                                                <div className={`invalid-feedback ${this.state.matchPassword ? "" : "active"}`}>password not match</div>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Verify Password</label>
                                            <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                                <input onChange={(e) => this.handleChangeText(e,'verify_password')} name="user_verify_password" className="form-control" type="password" placeholder="******" />
                                                <div className={`invalid-feedback ${this.state.matchPassword ? "" : "active"}`}>password not match</div>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-12 col-sm-12 col-md-3 col-lg-3"></label>
                                            <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                                {this.state.matchPassword ? <button onClick={this.saveUser} className="btn btn-primary mr-2">Save</button> : <button className="btn btn-secondary mr-2">Save</button>}
                                                <Link to={`${Config.basePath}user`} className="btn btn-secondary">Back</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default ContentWrapper(ContextConsumer(AdminAdd));