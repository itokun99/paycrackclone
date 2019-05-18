export const Setting = {
    isOnline : false,
    onlinePath : 'http://kes.co.id/dev/paycrack/',
    offlinePath : 'http://192.168.100.5/paycrack/',
    basePath : '/paycrack/'
}

const request = (url, method, data, formData = false) => {
    const promise = new Promise((resolve, reject) => {
        let option = {};
        if(method === "POST" || method === "post" || method === "put" || method === "PUT"){
            option.method = method;
            option.body = JSON.stringify(data);
        } else {
            option.method = method;
        }

        if(formData){
            option.body = data;
        } else {
            option.headers = {
                "Content-Type" : "application/json"
            }
        }

        fetch(`${Setting.isOnline ? Setting.onlinePath : Setting.offlinePath }${url}`,option)
        .then((response) => {
            if(response.ok){
                resolve(response.json())
            } else {
               resolve(response.json()); 
            }
        }).catch((error) => {
            console.log("error is", error);
            resolve(error.json())
        })
    })

    return promise;
}

const getUsers = (data = {}) => {
    let params = [];
    for(let key in data){
        params.push(key);
    }
    let url = `api/users${params.length > 0 ? "?" : ""}${typeof(data.id) !== "undefined" ? params.length > 1 ? "&id="+data.id : "id="+data.id : ""}${typeof(data.limit) !== "undefined" ? params.length > 1 ? "&limit="+data.limit : "?limit="+data.limit : ""}`;
    return request(url);
}

const createUser = (data = {}) => {
    let url = "api/users";
    let method = "POST";
    return request(url, method, data);
}

const updateUser = (data = {}) => {
    let url = "api/users";
    let method = "PUT";
    return request(url, method, data);
}

const deleteUser = (user_id) => {
    let url = `api/users?user_id=${user_id}`;
    let method = "DELETE";
    return request(url, method);
}

const loginAdmin = (data = {}) => {
    let url = 'api/users/adminlogin';
    let method = 'POST';
    return request(url, method, data); 
}

const deleteAdmin = (admin_id) => {
    let url = `api/users/admin?${admin_id}`;
    let method = "DELETE";
    return request(url, method);
}

const getOffers = (offer_id) => {
    let url = `api/offers?${offer_id}`
    return request(url);
}

const getItems = (data = {}) => {
    let url = `api/items`;
    return request(url);
}

const createItem = (data = {}) => {
    let url = 'api/items';
    let method = "POST";
    return request(url, method, data, true);
}
const updateItem = (data = {}) => {
    let url = 'api/items/update';
    let method = "POST";
    return request(url, method, data, true);
}
const deleteItem = (item_id) => {
    let url = `api/items?id=${item_id}`;
    let method = 'DELETE'
    return request(url, method);
}

const addPoint = (data = {}) => {
    let url = "api/users/addpoint";
    let method = "POST";
    return request(url, method, data);
}

const getHistoryPoint = (data = {}) => {
    let url = `api/history/point`;
    return request(url);
}

const getHistoryRedeem = (data = {}) => {
    let url = `api/history/redeem`;
    return request(url);
}

const updateRedeemStatus = (data = {}) => {
    let url = "api/history/redeem_status";
    let method = "POST";
    return request(url, method, data);
}

const userImportExcel = (data = {}) => {
    let url = "api/users/import_excel";
    let method = "POST"
    return request(url, method, data, true);
} 

const API  = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    loginAdmin,
    deleteAdmin,
    getOffers,
    getItems,
    createItem,
    deleteItem,
    updateItem,
    addPoint,
    getHistoryPoint,
    getHistoryRedeem,
    updateRedeemStatus,
    userImportExcel
}

export default API;