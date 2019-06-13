import React, {Component} from 'react';
import ContentWrapper from '../ContentWrapper';
import { ContextConsumer } from '../../context/Context';
import API from '../../services/Services';


class DailyCheckSetting extends Component {
    constructor(props){
        super(props);
        this.state = {
            slot : [],
            dailypointset : {
                point_value : []
            },
        }
    }

    getDailyPointSet = () => {
        let loginData = this.props.ContextState.loginData;
        let dailypointset = {...this.state.dailypointset}
        let params = {
            appkey : loginData.appkey
        }
        API.getDailySet(params)
        .then((result) => {
            if(result.status){
                result.data.map((value) => {
                    dailypointset.point_value.push(value.dc_point_value);
                    return true;
                })
                this.setState({
                    slot : result.data,
                    dailypointset :dailypointset
                });
            } else {
                console.log(result);
            }
        })
    }

    handleChangeText  = (input, slot) => {
        let name =  `${input.target.name}-${slot}`;
        let value = input.target.value;
        let dailypointset = {...this.state.dailypointset};
        switch(name){
            case `slot-${slot}`:
                dailypointset.point_value[slot] = value;
                break;
            default:
                return false;
        }
        this.setState({
            dailypointset : dailypointset
        }, () => {
            console.log(this.state.dailypointset);
        })
    }

    saveChanges = () => {
        let loginData = this.props.ContextState.loginData;
        let dailypointset = {...this.state.dailypointset};
        let slot = this.state.slot;
        let noValue = false;

        if(dailypointset.point_value.length !== slot.length){
            noValue = true;
        }

        dailypointset.point_value.map((value) => {
            if(value === ""){
                noValue = true;
            }
            return true;
        })

        if(noValue){
            alert("Please fill all field!")
        } else {
            dailypointset.appkey = loginData.appkey;
            API.saveDailySet(dailypointset)
            .then((result) => {
                if(result.status){
                    alert(result.message);
                } else {
                    console.log(result);
                    alert(result.message);
                }
            })
        }

    }



    componentDidMount(){
        this.getDailyPointSet();
    }


    render(){
        return(
            <div className="daily-section">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="row justify-content-center">
                                <div className="col-12 col-sm-12 col-md-8 col-lg-6">
                                    <div className="form-group">
                                        <h2>Daily Checkin Setting</h2>
                                    </div>
                                    <div className="form-group row justify-content-between">
                                        <label className="col-6 col-sm-6 col-md-3 col-lg-3"><strong>Name Slot</strong></label>
                                        
                                        <label className="col-6 col-sm-6 col-md-3 col-lg-3"><strong>Value</strong></label>
                                    </div>
                                    {
                                        this.state.slot.length > 0 ? 
                                        this.state.slot.map((value, index) => {
                                            return(
                                                <div key={index} className="form-group row justify-content-between">
                                                    <label className="col-6 col-sm-6 col-md-3 col-lg-3 col-form-label">Item {value.dc_point_slot}</label>
                                                    <div className="col-6 col-sm-6 col-md-3 col-lg-3">
                                                        <input onChange={(input) => this.handleChangeText(input, index)} type="number" placeholder="0" name="slot" style={{textAlign : "center"}} className="form-control" defaultValue={value.dc_point_value} />
                                                    </div>
                                                </div>
                                            )
                                        })
                                        :
                                        null
                                    }
                                    <div className="form-group">
                                        <button onClick={this.saveChanges} className="btn btn-primary">Save Changes</button>
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



export default ContentWrapper(ContextConsumer(DailyCheckSetting));