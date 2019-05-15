import React, {Component} from 'react';
import{NavLink} from 'react-router-dom';

class Sidebar extends Component {
    sidebarToggle = () => {
        this.props.wrapper.sidebarToggle()
    }
    render(){
        return(
            <div className={`sidebar-section ${this.props.wrapper.state.sidebar ? "active" : ""}`}>
                <div className="sidebar-header">
                    <span>PayCrack.</span>
                    <span onClick={this.sidebarToggle} className="menu-close">
                        <span></span>
                        <span></span>
                    </span>
                </div>
                <div className="sidebar-body">
                    <ul className="sidebar-nav">
                        <li><NavLink exact to="/">Dashboard</NavLink></li>
                        <li><NavLink to="/user">Users</NavLink></li>
                        <li><NavLink to="/point-history">Point History</NavLink></li>
                        <li><NavLink to="/redeem">Redeem</NavLink></li>
                        <li><NavLink to="/item">Items</NavLink></li>
                        <li><NavLink to="/setting">Setting</NavLink></li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default Sidebar;