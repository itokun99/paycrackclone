import React,  {Component} from 'react';
import ContentWrapper from '../ContentWrapper';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import API, { Setting } from '../../services/Services';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Modal from '../../components/Modal';
import { ContextConsumer } from '../../context/Context';

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}


class SpinnerEdit extends Component {
    constructor(props){
        super(props);
        this.state = {
            slot : [1,2,3,4,5,6,7,8,9,10],
            spinner_data : {
                probs : [],
            },
            admin_data : {
                email : "",
                password : ""
            },
            datePicker : {
                startDate : "",
                endDate : "",
            },
            dateAvaiableRange : {
                min : moment().format("YYYY-MM-DD"),
                max : moment().format("YYYY-MM-DD")
            },
            exclude_date : [],
            showModal : false,
            probablity : 0
        }
        this.handleChangeText2 = this.handleChangeText2.bind(this);
    }

    handleChangeDateStart = (date) => {
        let datePicker = {...this.state.datePicker }
        datePicker.startDate = moment(date).format('YYYY-MM-DD');
        datePicker.endDate = moment(date).format('YYYY-MM-DD');
        this.setState({
            datePicker : datePicker
        }, () => {
            console.log(this.state.datePicker)
        })
    }
    handleChangeDateEnd = (date) => {
        let datePicker = {...this.state.datePicker }
        datePicker.endDate = moment(date).format('YYYY-MM-DD');
        this.setState({
            datePicker : datePicker
        }, () => {
            console.log(this.state.datePicker)
        })
    }

    handleChangeText = (input, slot, index) => {
        let spinner_data = {...this.state.spinner_data};
        let name = `${input.target.name}-${slot}`;
        switch(name){
            case `probs-${slot}`:
                spinner_data.probs[index] = input.target.value; 
                break;
            default: 
                return false;
        }

        let countPercentage = 0
        spinner_data.probs.map((value) => {
            if(value !== ""){
                countPercentage += parseFloat(value)
            } else {
                countPercentage += 0;
            }
            return true;
        })

        this.setState({
            spinner_data : spinner_data,
            probablity  : 100 - countPercentage 
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
    
    saveSetting = () => {
        let loginData = this.props.ContextState.loginData;
        let slot  = this.state.slot;
        let spinner_data  = {...this.state.spinner_data};
        let admin_data = {...this.state.admin_data};
        let datePicker = {...this.state.datePicker};
        let noValue = false;

        if(spinner_data.probs.length !== slot.length ){
            alert("Please fill all input!");
        } else {
            for(var i = 0; i < slot.length; i++){
                if(spinner_data.probs[i] === ""){
                    noValue = true;
                }
            }
            if(datePicker.startDate === "" || datePicker.endDate === ""){
                noValue = true; 
            }
            if(noValue){
                alert("Please fill all input!")
            } else {
                if(this.state.probablity !== 0){
                    alert("Please fill to zero percentage all of slot avaiable")
                } else {
                    let noValue2 = false;
                    for(let key in admin_data){
                        if(admin_data[key] === ""){
                            noValue2 = true;
                        }
                    }
                    if(noValue2){
                        alert("Please fill confirmation form correctly");
                    } else {
                        var probs_data = spinner_data.probs.toString();
                        let send_data = {
                            probs_id : this.state.probs_id,
                            appkey : loginData.appkey,
                            username : admin_data.email,
                            password : admin_data.password,
                            probs_data : probs_data,
                            probs_start_date : datePicker.startDate,
                            probs_end_date : datePicker.endDate,
                        }
                        API.updateSpinnerProbsData(send_data)
                        .then((result) => {
                            if(result.status){
                                alert(result.message);
                                this.props.history.push(`${Setting.basePath}spinner`);
                            } else {
                                console.log(result)
                                alert(result.message);
                            }
                        })
                    }
                }
            }
        }
    }

    closeModal = () => {
        this.setState({
            showModal : false,
        })
    }

    showModal = () => {
        this.setState({
            showModal : true
        })
    }
    getDates = (startDate, stopDate) =>  {
        var dateArray = [];
        var currentDate = startDate;
        while (currentDate <= stopDate) {
            dateArray.push(new Date(currentDate));
            currentDate = currentDate.addDays(1);
        }
        return dateArray;
    }

    getProbsData = () => {
        let loginData = this.props.ContextState.loginData;
        let params = {
            appkey : loginData.appkey
        }
        API.getSpinnerProbsData(params)
        .then((result) => {
            if(result.status){
                let dateAvaiableRange = {...this.state.dateAvaiableRange};
                let data = result.data;
                let minDate = data[0].probs_start_date;
                let maxDate = data[data.length - 1].probs_end_date;
                dateAvaiableRange.min = moment(minDate).format("YYYY-MM-DD");
                dateAvaiableRange.max = moment(maxDate).format("YYYY-MM-DD");
                let exclude_date = [];
                let datePicker = this.state.datePicker;

                data.map((value) => {
                    
                    var datemin = value.probs_start_date;
                    var datemax = value.probs_end_date;

                    if(datePicker.startDate !== datemin && datePicker.endDate !== datemax){
                        var exluded = this.getDates(moment(datemin).toDate(), moment(datemax).toDate());
                        exclude_date.push(...exluded);
                    }
                    
                    return true;
                })
                this.setState({
                    exclude_date : exclude_date
                })
            }
        })
    }

    getCurrentProbs = (action = null) => {
        let spinner_data = this.state.spinner_data;
        let dataFromProps = this.props.history.location.state;
        // console.log(dataFromProps)
        if(typeof(dataFromProps) !== "undefined"){
            let probs = dataFromProps.probs;
            let start_date = probs.probs_start_date;
            let end_date = probs.probs_end_date;
            let probs_data = probs.probs_data;
            let probs_id = probs.probs_id;
            // console.log(probs_data)
            probs_data = probs_data.split(',');
            spinner_data.probs = probs_data;
            this.setState({
                probs_id : probs_id,
                datePicker : {
                    startDate : start_date,
                    endDate : end_date,
                },
                spinner_data : spinner_data
            }, action)

        } else {
            this.props.history.push(`${Setting.basePath}spinner`);
        }
        
    }
    
    componentDidMount(){
        document.getElementById('panel-title').innerText = "Add Probablity"
        document.title = "Add Probablity";
        this.getCurrentProbs(this.getProbsData());
        console.log(this.props)
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
                                        <h2>Add Spinner Probablity</h2>
                                        <div className="row">
                                            <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                                <div className="form-group">
                                                    <label>Start From</label>
                                                    <DatePicker
                                                        selected={this.state.datePicker.startDate === "" ? this.state.datePicker.startDate : moment(this.state.datePicker.startDate).toDate()}
                                                        onChange={(e) => this.handleChangeDateStart(e)}
                                                        className="form-control"
                                                        dateFormat="dd-MMMM-yyyy"
                                                        minDate={moment(this.state.dateAvaiableRange.min).toDate()}
                                                        excludeDates={this.state.exclude_date}
                                                        placeholderText="Select start date"
                                                        withPortal
                                                        style={{width : '100%'}}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                                <div className="form-group">
                                                    <label>End From</label>
                                                    <DatePicker
                                                        selected={this.state.datePicker.endDate === "" ? this.state.datePicker.endDate : moment(this.state.datePicker.endDate).toDate() }
                                                        onChange={(e) => this.handleChangeDateEnd(e)}
                                                        className="form-control"
                                                        dateFormat="dd-MMMM-yyyy"
                                                        minDate={moment(this.state.dateAvaiableRange.min).toDate()}
                                                        excludeDates={this.state.exclude_date}
                                                        placeholderText="Select end date"
                                                        withPortal
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group" style={{display: 'flex', justifyContent : "space-between"}}>
                                            <span></span>
                                            <span className="probs-count"><strong>Percentage Avaiable : {this.state.probablity}%</strong></span>
                                        </div>
                                        {
                                            this.state.spinner_data.probs.length > 0 ?
                                            this.state.slot.map((value, index) => {
                                                return(
                                                    <div key={index} className="form-group row">
                                                        <label className="col-6 col-sm-6 col-md-4 col-lg-4  col-form-label">{value === 1 ? "Mistery Price" : `Slot ${value}`}</label>
                                                        <div className="col-2 col-sm-2 col-md-4 col-lg-4"></div>
                                                        <div className="col-4 col-sm-4 col-md-4 col-lg-4">
                                                            <input type="number" defaultValue={this.state.spinner_data.probs[index]} min={0} onChange={(e) => this.handleChangeText(e, value, index )} className="form-control" name={`probs`} placeholder="Probablity" />
                                                        </div>
                                                    </div>      
                                                )
                                            })
                                            :
                                            this.state.slot.map((value, index) => {
                                                return(
                                                    <div key={index} className="form-group row">
                                                        <label className="col-6 col-sm-6 col-md-4 col-lg-4  col-form-label">{value === 1 ? "Mistery Price" : `Slot ${value}`}</label>
                                                        <div className="col-2 col-sm-2 col-md-4 col-lg-4"></div>
                                                        <div className="col-4 col-sm-4 col-md-4 col-lg-4">
                                                            <input type="number" min={0} onChange={(e) => this.handleChangeText(e, value, index )} className="form-control" name={`probs`} placeholder="Probablity" />
                                                        </div>
                                                    </div>      
                                                )
                                            })
                                        }
                                        <div className="form-group">
                                            <button onClick={this.showModal} className="btn btn-primary">Save Probablity</button>
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
                                    <input onChange={this.handleChangeText2} className="form-control" type="text" placeholder="Username" name="email" />
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
export default ContentWrapper(ContextConsumer(SpinnerEdit));