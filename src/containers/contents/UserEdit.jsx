import React, {Component} from 'react';
import ContentWrapper from '../ContentWrapper';
import API, { Setting as Config } from '../../services/Services';
import { Link } from 'react-router-dom/cjs/react-router-dom';
class UserEdit extends Component {
    state = {
        user : {
            user_id : "",
            user_name: "",
            user_fullname: "",
            user_old_password : "",
            user_password : "",
            user_verify_password : ""
        },
        changePassword : false,
        matchPassword : true,
    }

    handleChangeText = (input) => {
        let user = {...this.state.user}
        let name = input.target.name;
        let verifyPassword  = true;
        switch(name){
            case "user_fullname":
                user.user_fullname = input.target.value;
                break;
            case "user_name":
                user.user_name = input.target.value;
                break;
            case "user_old_password":
                user.user_old_password = input.target.value;
                break;
            case "user_password":
                user.user_password = input.target.value;
                break;
            case "user_verify_password":
                user.user_verify_password = input.target.value;
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

    saveChangeUser = () => {
        let user = {...this.state.user}
        let noValue = false;
        if(this.state.changePassword){
            for(let key in user){
                if(user[key] === ""){
                    noValue = true
                }
            }
        } else {
            for(let key in user){
                if(user[key] === "" && key !== "user_old_password" && key !== "user_password" && key !== "user_verify_password"){
                    noValue = true
                }
            }
        }

        if(noValue){
            alert("Please fill the form correctly!");
        } else {
            API.updateUser(user)
            .then((response) => {
                if(response.status){
                    alert(response.message);
                    // window.location.href = '/user';
                    this.props.history.push(`${Config.basePath}user`);
                } else {
                    alert(response.message)
                    console.log(response);
                }
            })
        }
    }

    handleChangePassword = () => {
        let user = {...this.state.user};
        user.user_password = "";
        user.user_old_password = "";
        user.user_verify_password = "";
        this.setState({
            changePassword : !this.state.changePassword,
            matchPassword : true,
            user : user
        })
    }

    getData = () => {
        let user = {...this.state.user};
        let user_id = this.props.match.params.id;
        let data = {};
        if(typeof(this.props.history.location.state) === "undefined"){
            API.getUsers({
                id : user_id
            }).then((response) => {
                if(response.status){
                    data = response.data[0];
                    user.user_id = data.user_id; 
                    user.user_name = data.user_name; 
                    user.user_fullname = data.user_fullname;
                    this.setState({
                        user : user
                    }, () => {
                        console.log(this.state.user);
                    })
                } else {
                    alert(response.message);
                    console.log(response);
                }
            })
        } else {
            data = this.props.history.location.state.user_data;
            user.user_id = data.user_id; 
            user.user_name = data.user_name; 
            user.user_fullname = data.user_fullname; 
            this.setState({
                user : user
            }, () => {
                console.log(this.state.user);
            })
        }
    }

    componentDidMount(){
        document.getElementById('panel-title').innerText = "Edit User";
        document.title = "Edit User";
        this.getData();
    }

    render(){
        console.log(this)
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
                                    {
                                        this.state.changePassword ? 
                                        <>
                                            <div className="form-group row">
                                                <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Password</label>
                                                <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                                    <span onClick={this.handleChangePassword} style={{display: "inline-block",color : "blue", paddingTop : 8, cursor : "pointer"}}>use old password?</span>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label"></label>
                                                <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                                    <input onChange={(e) => this.handleChangeText(e)} name="user_old_password" className="form-control" type="password" placeholder="Old Password" defaultValue={this.state.user.user_old_password} />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label"></label>
                                                <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                                    <input onChange={(e) => this.handleChangeText(e)} name="user_password" className="form-control" type="password" placeholder="New Password" defaultValue={this.state.user.user_password} />
                                                    <div className={`invalid-feedback ${this.state.matchPassword ? "" : "active"}`}>password not match</div>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label"></label>
                                                <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                                    <input onChange={(e) => this.handleChangeText(e)} name="user_verify_password" className="form-control" type="password" placeholder="Verify Password" defaultValue={this.state.user.user_verify_password} />
                                                    <div className={`invalid-feedback ${this.state.matchPassword ? "" : "active"}`}>password not match</div>
                                                </div>
                                            </div>
                                        </>
                                        :
                                        <div className="form-group row">
                                            <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Password</label>
                                            <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                                <span onClick={this.handleChangePassword} style={{display: "inline-block",color : "blue", paddingTop : 8, cursor : "pointer"}}>change password?</span>
                                            </div>
                                        </div>
                                    }
                                    <div className="form-group row">
                                        <label className="col-12 col-sm-12 col-md-3 col-lg-3"></label>
                                        <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                            {this.state.matchPassword ? <button onClick={this.saveChangeUser} className="btn btn-primary mr-2">Save Change</button> : <button className="btn btn-secondary mr-2">Save Change</button>}
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
export default ContentWrapper(UserEdit);