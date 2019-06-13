import React  from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css'


const UserDataTable = (props) => {
    const dataTableColumns = [
        { 
            Header : "#",
            sortable : true,
            maxWidth : 50, 
            style : {textAlign : "center"}, 
            filterable : false,
            Cell: row => (<div onClick={() => props.previewUser(row.original)}>{row.index+1}</div>)
        },{ 
            Header : "ID", 
            sortable : true, 
            accessor : "user_id", 
            style : {textAlign : "center"}, 
            Cell: row => (<div onClick={() => props.previewUser(row.original)}>{row.value}</div>)
        },{ 
            Header : "Name", 
            sortable : true, 
            accessor : "user_fullname", 
            style : {textAlign : "center"}, 
            Cell: row => (<div onClick={() => props.previewUser(row.original)}>{row.value}</div>)
        },{ 
            Header : "Username", 
            accessor : "user_name", 
            sortable : true, 
            style : {textAlign : "center"}, 
            Cell: row => (<div onClick={() => props.previewUser(row.original)}>{row.value}</div>)
        },{ 
            Header : "Point", 
            sortable : true, 
            accessor : "user_point", 
            style : {textAlign : "center"}
        },{ 
            Header : "Status", 
            accessor : "user_status", 
            sortable : true, 
            style : {textAlign : "center"},
            Cell : row => {
                let status;
                if(row.value === "1"){
                    status = "Active"
                } else {
                    status = "Deactive"
                }
                return <div>{status}</div>
            },
            Filter: ({ filter, onChange }) =>
            <select
                onChange={event => onChange(event.target.value)}
                style={{ width: "100%" }}
                value={filter ? filter.value : "1"}
            >
                <option value="1">Active</option>
                <option value="0">Deactive</option>
            </select>
        }
    ];
    return(
        <ReactTable
            title="User Table"
            columns={dataTableColumns}
            data={props.data}
            selectableRows = {null}
            defaultPageSize = {props.data.length < 50 ? 25 : 50 }
            filterable={true}
        />
    )
}

export default UserDataTable;