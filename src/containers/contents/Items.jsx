import React, {Component} from 'react';
import ContentWrapper from '../ContentWrapper';
import API, { Setting } from '../../services/Services';
import { Icon } from 'react-icons-kit';
import {plus} from 'react-icons-kit/icomoon/plus';
import {ic_delete} from 'react-icons-kit/md/ic_delete';
import {ic_mode_edit} from 'react-icons-kit/md/ic_mode_edit';
import Modal from '../../components/Modal';

class Items extends Component {
    state = {
        items : [],
        itemsIsLoading : false,
        modalShow : false,
        modalTitle : "",
        itemNew : {
            item_name : "",
            item_point : "",
            item_description : "",
            item_pic_file: "",
            item_pic_source : "",
        },
        isEdit : false,
    }

    getItem = () => {
        API.getItems()
        .then((response) => {
            if(response.status){
                this.setState({
                    items : response.data
                })
            } else {
                console.log(response);
                this.setState({
                    items : []
                })
            }
        })
    }

    saveItem = () => {
        let itemNew = {...this.state.itemNew}
        
        let noValue = false;
        for(let key in itemNew){
            if(itemNew[key] === ""){
                noValue = true;
            }
        }
        if(noValue){
            alert("Please insert the picture and fill the form correctly");
        } else {
            // send with form data //
            let formData = new FormData();
            itemNew.item_pic_source = "";
            formData.append('item_pic', itemNew.item_pic_file);
            itemNew.item_pic_file = "";
            formData.append('item_data', JSON.stringify(itemNew));

            API.createItem(formData)
            .then((response) => {
                console.log(response);
                if(response.status){
                    alert(response.message);
                    this.setState({
                        modalShow : false,
                    }, () => {
                        this.getItem();
                    })
                } else {
                    alert(response.message);
                }
            })
        }        
    }

    handleEditButton = (item) => {
        let itemNew = {
            item_id : item.item_id,
            item_name : item.item_name,
            item_point : item.item_point,
            item_description : item.item_description,
            item_pic_file: "",
            item_pic_old : item.item_pic,
            item_pic_source : `${Setting.isOnline ? Setting.onlinePath : Setting.offlinePath}${item.item_pic}`,
        };
        this.setState({
            isEdit : true,
            modalShow : true,
            modalTitle : "Edit Item",
            itemNew : itemNew
        }, () => {console.log(this.state.itemNew)})
    }

    editItem = () => {
        let itemNew = {...this.state.itemNew};
        
        let noValue = false;
        for(let key in itemNew){
            if(itemNew[key] === ""){
                if(key !== "item_pic_file"){
                    noValue = true;
                }
            }
        }
        if(noValue){
            alert("Please insert the picture and fill the form correctly");
        } else {
            // send with form data //
            let formData = new FormData();
            if(itemNew.item_pic_file === ""){
                itemNew.item_pic_file = "";
            }
            formData.append('item_pic', itemNew.item_pic_file);
            itemNew.item_pic_file = "";
            formData.append('item_data', JSON.stringify(itemNew));
        
            API.updateItem(formData)
            .then((response) => {
                console.log(response);
                if(response.status){
                    alert(response.message);
                    this.setState({
                        isEdit : false,
                        modalShow : false,
                        itemNew : {
                            item_name : "",
                            item_point : "",
                            item_description : "",
                            item_pic_file: "",
                            item_pic_source : "",
                        }
                    },() => {
                        this.getItem();
                    })
                } else {
                    alert(response.message);
                }
            })

        }

    }

    deleteItem = (item_id) => {
        let conf = window.confirm("Want to delete this item?");
        if(conf){
            API.deleteItem(item_id)
            .then((response) => {
                if(response.status){
                    alert(response.message);
                    this.getItem();
                } else {
                    alert(response.message);
                }
            })
        } else {
            return false;
        }
    }

    openModal = (title) => {
        this.setState({
            modalShow : true,
            modalTitle : title,
            itemNew : {
                item_name : "",
                item_point : "",
                item_description : "",
                item_pic_file: "",
                item_pic_source : "",
            }
        })
    }

    closeModal = () => {
        this.setState({
            isEdit : false,
            modalShow : false,
            modalTitle : "",
            itemNew : {
                item_name : "",
                item_point : "",
                item_description : "",
                item_pic_file: "",
                item_pic_source : "",
            }
        })
    }

    handleChangeText = (input) => {
        // console.log(input.target.files[0]);
        let name = input.target.name;
        let value = input.target.value;
        let  newItem = {...this.state.itemNew}
        let uploadImage = false;
        switch(name){
            case "item_name":
                newItem.item_name = value 
                break;
            case "item_point":
                newItem.item_point = value 
                break;
            case "item_description":
                newItem.item_description = value 
                break;
            case "item_pic":
                uploadImage = true
                newItem.item_pic_file = input.target.files[0];
                let reader = new FileReader();
                reader.onloadend = () => {
                    newItem.item_pic_source = reader.result;
                }
                if(input.target.files[0]){
                    reader.readAsDataURL(input.target.files[0]);
                }

                break;
            default:
                return false;
        }
        setTimeout(() => {
            this.setState({
                itemNew : newItem
            }, () => {
                console.log(this.state.itemNew)
            })
        }, uploadImage ? 100 : 0);
    }



    componentDidMount(){
        document.getElementById('panel-title').innerText = "Item Lists";
        document.title = "Manage Items";
        this.getItem();
    }
    render(){
        return(
            <>
                <div className="item-section">
                    <div className="row">
                        <div className="col-12">

                            <div className="item-main">
                                <div className="row">
                                    <div className="col-12 item-header mb-4">
                                        <button onClick={() => this.openModal("Add New Item")} className="btn btn-primary"><Icon size={14} icon={plus}></Icon> Add Item</button>
                                    </div>
                                    {this.state.items.length > 0 ? 
                                        this.state.items.map((item, index) => {
                                            return(
                                                <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                                    <div className="item-content card">
                                                        <div className="card-img" style={{backgroundImage: `url(${Setting.isOnline ? Setting.onlinePath : Setting.offlinePath}${item.item_pic})`}}>
                                                            {/* <img alt={item.item_title} title={item.item_title} src={`${Setting.isOnline ? Setting.onlinePath : Setting.offlinePath}${item.item_pic}`} /> */}
                                                        </div>
                                                        <h4 className="item-title card-title">{item.item_name}</h4>
                                                        <p className="item-description card-text">{item.item_point} Point</p>
                                                        <div className="item-action">
                                                            <span onClick={() => this.handleEditButton(item)} className="edit"><Icon size={24} icon={ic_mode_edit}></Icon></span>
                                                            <span onClick={() => this.deleteItem(item.item_id)} className="delete"><Icon size={24} icon={ic_delete}></Icon></span>
                                                        </div>  
                                                    </div>
                                                </div>
                                            )
                                        })
                                    :
                                        <div className="col-12">
                                            <div className="no-item-el">
                                                <span>NO DATA</span>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.modalShow ? 
                    <Modal size="medium">
                        <div className="modal-header">
                            <h5 className="modal-title">{this.state.modalTitle}</h5>
                            <span onClick={this.closeModal} className="modal-close">&times;</span>
                        </div>
                        <div className="modal-body">
                            <div className="item-add-form">
                                <div className="form-group">
                                    <div className="pic-wrapper" style={{backgroundImage : `url(${this.state.itemNew.item_pic_source})`}}>
                                        <input onChange={(e) => this.handleChangeText(e)} className="pic-input" name="item_pic" type="file" accept=".jpg,.png,.jpeg"  />
                                        <span>Upload Image</span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Name</label>
                                    <input onChange={(e) => this.handleChangeText(e)} type="text" className="form-control" name="item_name" placeholder="Name of item" defaultValue={this.state.itemNew.item_name}/>
                                </div>
                                <div className="form-group">
                                    <label>Point value</label>
                                    <input onChange={(e) => this.handleChangeText(e)} type="number" className="form-control" name="item_point" placeholder="Value" defaultValue={this.state.itemNew.item_point} />
                                </div>
                                <div className="form-group m-0">
                                    <label>Description</label>
                                    <textarea onChange={(e) => this.handleChangeText(e)} rows={5} className="form-control" name="item_description" placeholder="Describe the item..." value={this.state.itemNew.item_description}></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            {this.state.isEdit ?
                                <button onClick={this.editItem} className="btn btn-primary">Edit Item</button>
                            :
                                <button onClick={this.saveItem} className="btn btn-primary">Save Item</button>
                            }
                            &nbsp;&nbsp;
                            <button onClick={this.closeModal} className="btn btn-secondary">Cancel</button>
                        </div>
                    </Modal>
                :
                ""
                }
            </>
        )
    }
}


export default ContentWrapper(Items);