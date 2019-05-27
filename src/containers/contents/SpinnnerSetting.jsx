import React,  {Component} from 'react';
import ContentWrapper from '../ContentWrapper';
import Modal from '../../components/Modal';
import API, { Setting } from '../../services/Services';
import { Link } from 'react-router-dom';
import { ContextConsumer } from '../../context/Context';
class SpinnerSetting extends Component {
    constructor(props){
        super(props);
        this.state = {
            slot : [],
            spinner_data : {
                probs : [],
                values : [],
            },
            admin_data : {
                email : "",
                password : ""
            },
            showModal : false,
            percentCounter : 100,
        }
        this.handleChangeText2 = this.handleChangeText2.bind(this);
    }

    handleChangeText = (input, slot, index) => {
        let spinner_data = {...this.state.spinner_data};
        let name = `${input.target.name}-${slot}`;
        switch(name){
            case `values-${slot}`:
                spinner_data.values[index] = input.target.value; 
                break;
            case `probs-${slot}`:
                spinner_data.probs[index] = input.target.value; 
                break;
            default: 
                return false;
        }

        let counter = 0;
        spinner_data.probs.map((value) => {
            if(value !== ""){
                counter += parseFloat(value);
            } else {
                counter += 0;
            }
        })
        

        this.setState({
            spinner_data : spinner_data,
            percentCounter : 100 - counter
        })
    }

    handleChangeText2 = (input) => {
        let name = input.target.name;
        let admin_data = {...this.state.admin_data};
        switch(name){
            case "email":
                admin_data.email = input.target.value;
                break;
            case "password":
                admin_data.password = input.target.value;
                break;
            default:
                return false
        }
        
        this.setState({
            admin_data : admin_data
        })
    }
    
    closeModal = () => {
        this.setState({
            showModal : false,
        })
    }

    openModal = () => {
        this.setState({
            showModal : true,
        })
    }
    
    saveSetting = () => {
        let loginData = this.props.ContextState.loginData;
        let slot  = this.state.slot;
        let spinner_data  = {...this.state.spinner_data};
        let noValue = false;
        let admin_data = {...this.state.admin_data};
        let limit = this.state.percentCounter;

        if(spinner_data.values.length !== slot.length || spinner_data.probs.length !== slot.length ){
            alert("Please fill all input field!");
        } else {
            for(var i = 0; i < slot.length; i++){
                if(spinner_data.values[i] === "" || spinner_data.probs[i] === ""){
                    noValue = true;
                }
            }
            if(noValue){
                alert("Please fill all input field!");
            } else {
                if(limit < 0){
                    alert("Please pass the limit into 100%");                
                } else {
                    noValue = false;
                    for(let key in admin_data){
                        if(admin_data[key] === ""){
                            noValue = true;
                        }
                    }
                    if(noValue){
                        alert("Please insert username/password for verification");                
                    } else {
                        let send_data = {
                            appkey : loginData.appkey,
                            username : admin_data.email,
                            password : admin_data.password,
                            ...spinner_data,

                        }
                        // console.log(send_data);
                        API.updateSpinnerProbsSettingData(send_data)
                        .then((result) => {
                            console.log(result);
                            if(result.status){
                                alert(result.message)
                            } else {
                                alert(result.message);
                            }
                        })
                    }
                }
            }
        }
    }
    getProbsSetting = () => {
        let loginData = this.props.ContextState.loginData;
        let spinner_data = {...this.state.spinner_data};
        let params = {
            appkey : loginData.appkey
        }
        API.getSpinnerSettingData(params)
        .then((result) => {
            if(result.status){
                result.data.map((value, index) => {
                    spinner_data.probs.push(parseFloat(value.spinner_probablity));
                    spinner_data.values.push(isNaN(value.spinner_value) ? value.spinner_value : parseFloat(value.spinner_value) );
                })
                this.setState({
                    slot : result.data,
                    spinner_data : spinner_data
                }, () => {
                    console.log(this.state.spinner_data)
                })
            }
        })
    }

    componentDidMount(){
        this.getProbsSetting();
    }


    render(){
        return(
            <>
                <div className='spinner-setting'>
                    <div className="row">
                        <div className="col-12">
                            <div className="spinner-setting-main card">
                                <div className="row justify-content-center">
                                    <div className="col-12 col-sm-12 col-md-8 col-lg-8">
                                        <h2>Spinner Setting</h2>
                                        <div className="form-group row">
                                            <div className="col-12 col-sm-12 col-md-4 col-md-4"><strong>Slot</strong></div>
                                            <div className="col-12 col-sm-12 col-md-4 col-md-4"><strong>Value</strong></div>
                                            <div className="col-12 col-sm-12 col-md-4 col-md-4"><strong>Probablity</strong><span style={{float: "right"}}><strong>Limit {this.state.percentCounter}%</strong></span></div>
                                        </div>
                                        {
                                            this.state.slot.map((value, index) => {
                                                return(
                                                    <div key={index} className="form-group row">
                                                        <label className="col-12 col-sm-12 col-md-4 col-lg-4  col-form-label">{value.spinner_name}</label>
                                                        <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                                                            <input type="text" min={0} onChange={(e) => this.handleChangeText(e, index+1, index )} className="form-control" defaultValue={value.spinner_value} name={`values`} placeholder="Value" />
                                                        </div>
                                                        <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                                                            <input type="number" min={0} onChange={(e) => this.handleChangeText(e, index+1, index )} className="form-control" defaultValue={value.spinner_probablity} name={`probs`} placeholder="Probablity" />
                                                        </div>
                                                    </div>      
                                                )
                                            })
                                        }
                                        <div className="form-group" style={{textAlign : "right"}}>
                                            <button onClick={this.openModal} className="btn btn-primary">Save Setting</button>
                                            <Link to={`${Setting.basePath}spinner`} className="ml-2 btn btn-secondary">Back</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.state.showModal ?
                    <Modal>
                        <div className="modal-header">
                            <h5 className="modal-title">Confirmation</h5>
                            <span onClick={this.closeModal} className="modal-close">&times;</span>
                        </div>
                        <div className="modal-body">
                            <div className="form-group row">
                                <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Username</label>
                                <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                    <input onChange={this.handleChangeText2} className="form-control" type="email" placeholder="Username" name="email" />
                                </div>
                            </div>
                            <div className="form-group row mb-0">
                                <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Password</label>
                                <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                    <input onChange={this.handleChangeText2} className="form-control" type="password" placeholder="*****" name="password" />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={this.saveSetting} className="btn btn-primary">Submit</button>
                            <button onClick={this.closeModal} className="btn btn-secondary ml-2">Cancel</button>
                        </div>
                    </Modal>
                    :
                    <></>
                }
            
            </>

        )
    }
}

export default ContentWrapper(ContextConsumer(SpinnerSetting));