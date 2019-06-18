import React, {Component} from 'react';
import ContentWrapper from '../ContentWrapper';
import { ContextConsumer } from '../../context/Context';
import API from '../../services/Services';


class Banner extends Component {
    constructor(props){
        super(props);
        this.state = {
            banners : [],
        }
    }

    getBannerData = () => {
        let loginData = this.props.ContextState.loginData;
        let params = {
            appkey : loginData.appkey
        }
        API.getBannerData(params)
        .then((result) => {
            if(result.status){
                let data = result.data;
                this.setState({
                    banners : data
                }) 
            } else {
                console.log(result);
            }
        })
    }

    handleChangeText  = (input, index) => {
        let name =  input.target.name;
        let value = input.target.value;
        let banners = this.state.banners;
        
        switch(name){
            case "banner_url":
                banners[index].banner_url = value;
                break;
            case "image_url":
                banners[index].banner_img = value;
                break;
            default:
                return false;
        }

        this.setState({
            banners : banners
        }, () => {
            console.log(this.state.banners);
        })
    }

    saveChanges = () => {
        let banners = this.state.banners;
        let loginData = this.props.ContextState.loginData;

        let data = {
            appkey : loginData.appkey,
            banner_data : banners,
        }
        API.updateBannerSetting(data)
        .then((result) => {
            console.log(result);
            if(result.status){
                alert(result.message);
            } else {
                console.log(result)
            }
        })
    }



    componentDidMount(){
        this.getBannerData();
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
                                        <h2>Banner Setting</h2>
                                    </div>
                                    <div className="form-group row">
                                        <h3 className="col-12">Banner (325 x 200)</h3>
                                        <div className="col-12">
                                            <div className="form-group row" style={{marginBottom : 5}}>
                                                <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Banner Url</label>
                                                <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                                    <input type="text" className="form-control" defaultValue={this.state.banners.length > 0 ? this.state.banners[0].banner_url : ""} onChange={(e) => this.handleChangeText(e, 0 )} name='banner_url' placeholder="insert link banner" />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Image Url</label>
                                                <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                                    <input type="text" className="form-control" defaultValue={this.state.banners.length > 0 ? this.state.banners[0].banner_img : ""} onChange={(e) => this.handleChangeText(e, 0 )} name="image_url" placeholder="insert link banner" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="form-group row">
                                        <h3 className="col-12">Banner (728 x 90)</h3>
                                        <div className="col-12">
                                            <div className="form-group row" style={{marginBottom : 5}}>
                                                <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Banner Url</label>
                                                <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                                    <input type="text" className="form-control" defaultValue={this.state.banners.length > 0 ? this.state.banners[1].banner_url : ""} onChange={(e) => this.handleChangeText(e, 1 )} name="banner_url" placeholder="insert link banner" />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Image Url</label>
                                                <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                                    <input type="text" className="form-control" defaultValue={this.state.banners.length > 0 ? this.state.banners[1].banner_img : ""} onChange={(e) => this.handleChangeText(e, 1 )} name="image_url" placeholder="insert link banner" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <button onClick={this.saveChanges} className="btn btn-primary">Save Change</button>
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



export default ContentWrapper(ContextConsumer(Banner));