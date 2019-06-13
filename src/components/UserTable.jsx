import React  from 'react';

const UserTable = (props) => {
    return(
        <table className="table table-hover table-bordered font-sm">
            <thead className="">
                <tr>
                    <th style={{textAlign:"center", width : 50}}>#</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Username</th>
                    <th style={{textAlign:"center"}}>Point</th>
                    <th style={{textAlign:"center"}}>Status</th>
                </tr>
            </thead>
            <tbody>
                {props.data.length > 0 ?
                    props.data.map((value, index) => {
                        return(
                            <tr key={index}>
                                <td style={{textAlign:"center"}}>{parseInt(props.index)+1+index }</td>
                                <td style={{textAlign:"center"}}>{value.user_id}</td>
                                <td onClick={() => props.preview(value)} style={{cursor : "pointer"}}>{value.user_fullname}</td>
                                <td>{value.user_name}</td>
                                <td style={{textAlign:"center"}}>{value.user_point}</td>
                                <td style={{textAlign:"center"}}>{value.user_status === "1" ? "active" : "not active" }</td>
                            </tr>
                        )
                    })
                :
                    <tr>
                        <td colSpan={6} style={{textAlign:'center'}}>Tidak ada data</td>
                    </tr>
                }
            </tbody>
        </table>
    )
}

export default UserTable;