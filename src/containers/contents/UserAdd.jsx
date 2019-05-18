import React, {Component} from 'react';
import ContentWrapper from '../ContentWrapper';
import API, { Setting as Config } from '../../services/Services';
import { Link } from 'react-router-dom/cjs/react-router-dom';
class UserAdd extends Component {
    state = {
        user : {
            // user_referral_code: "",
            user_name: "",
            user_fullname: "",
            user_email: "",
            user_password: "",
            user_point: 0,
            user_verify_password : "",
        },
        matchPassword : true,
    }

    handleChangeText = (input) => {
        let user = {...this.state.user}
        let name = input.target.name;
        let verifyPassword = true;
        switch(name){
            case "user_fullname":
                user.user_fullname = input.target.value;
                break;
            case "user_name":
                user.user_name = input.target.value;
                break;
            case "user_email":
                user.user_email = input.target.value;
                break;
            case "user_password":
                user.user_password = input.target.value;
                break;
            case "user_verify_password":
                user.user_verify_password = input.target.value;
                break;
            case "user_point":
                user.user_point = input.target.value;
                break;
            default:
                return false;
        }
        if(user.user_password !== user.user_verify_password){
            verifyPassword = false;
        }

        this.setState({
            user : user,
            matchPassword : verifyPassword
        })
    }

    saveUser = () => {
        let user = {...this.state.user};
        let noValue = false;
        for(let key in user){
            if(user[key] === "" ){
                noValue = true
            }
        }
        if(noValue){
            alert("Please fill the form correctly!");
        } else {
            API.createUser(user)
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

    componentDidMount(){
        document.getElementById('panel-title').innerText = "Add User"
        document.title = "Add User"
    }

    render(){
        return(
            <div className="adduser-section">
                <div className="row">
                    <div className="col-12">
                        <div className="adduser-main card">
                            <div className="row justify-content-center">
                                <div className="col-12 col-sm-12 col-md-8 col-lg-8">
                                    <div className="form-group">
                                        <h2 className="m-0">User Regisration</h2>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Fullname</label>
                                        <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                            <input onChange={(e) => this.handleChangeText(e)} name="user_fullname" className="form-control" type="text" placeholder="John Doe" defaultValue={this.state.user.user_fullname} />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Username</label>
                                        <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                            <input onChange={(e) => this.handleChangeText(e)} name="user_name" className="form-control" type="text" placeholder="username" defaultValue={this.state.user.user_name} />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Email</label>
                                        <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                            <input onChange={(e) => this.handleChangeText(e)} name="user_email" className="form-control" type="email" placeholder="example@mail.com" defaultValue={this.state.user.user_email} />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Password</label>
                                        <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                            <input onChange={(e) => this.handleChangeText(e)} name="user_password" className="form-control" type="password" placeholder="******" defaultValue={this.state.user.user_password} />
                                            <div className={`invalid-feedback ${this.state.matchPassword ? "" : "active"}`}>password not match</div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Verify Password</label>
                                        <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                            <input onChange={(e) => this.handleChangeText(e)} name="user_verify_password" className="form-control" type="password" placeholder="******" defaultValue={this.state.user.user_verify_password} />
                                            <div className={`invalid-feedback ${this.state.matchPassword ? "" : "active"}`}>password not match</div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Start Point</label>
                                        <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                            <input onChange={(e) => this.handleChangeText(e)} name="user_point" className="form-control" type="text" placeholder="0" defaultValue={this.state.user.user_point} />
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
        )
    }
}
export default ContentWrapper(UserAdd);