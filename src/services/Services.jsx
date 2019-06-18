let key;
export const Setting = {
    isOnline : false,
    onlinePath : 'http://kes.co.id/dev/paycrack/',
    offlinePath : 'http://192.168.100.5/paycrack/',
    basePath : '/'
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
    let params = 0;
    for(key in data){
        params++;
    }
    let appkey = `${typeof(data.appkey) !== "undefined" ? params > 1 ? "&appkey="+data.appkey : "appkey="+data.appkey : ""}`;
    let id = `${typeof(data.id) !== "undefined" ? params > 1 ? "&id="+data.id : "id="+data.id : ""}`;
    let limit = `${typeof(data.limit) !== "undefined" ? params > 1 ? "&limit="+data.limit : "limit="+data.limit : ""}`;
    let offset = `${typeof(data.offset) !== "undefined" ? params > 1 ? "&offset="+data.offset : "offset="+data.offset : ""}`;
    let url = `api/users${params > 0 ? "?" : ""}${appkey}${id}${limit}${offset}`;
    return request(url);
}

const getAdmin = (data = {}) => {
    let params = 0;
    for(key in data){
        params++;
    }
    let appkey = `${typeof(data.appkey) !== "undefined" ? params > 1 ? "&appkey="+data.appkey : "appkey="+data.appkey : ""}`;
    let id = `${typeof(data.id) !== "undefined" ? params > 1 ? "&id="+data.id : "id="+data.id : ""}`;
    let limit = `${typeof(data.limit) !== "undefined" ? params > 1 ? "&limit="+data.limit : "limit="+data.limit : ""}`;
    let offset = `${typeof(data.offset) !== "undefined" ? params > 1 ? "&offset="+data.offset : "offset="+data.offset : ""}`;
    let url = `api/users/admin${params > 0 ? "?" : ""}${appkey}${id}${limit}${offset}`;
    return request(url);
}

const createAdmin = (data = {}) => {
    let url = "api/users/admin";
    let method = "POST";
    return request(url, method, data);
}

const updateAdmin = (data = {}) => {
    let url = "api/users/admin";
    let method = "PUT";
    return request(url, method, data);
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

const deleteUser = (appkey, user_id) => {
    let url = `api/users?appkey=${appkey}&user_id=${user_id}`;
    let method = "DELETE";
    return request(url, method);
}

const loginAdmin = (data = {}) => {
    let url = 'api/users/adminlogin';
    let method = 'POST';
    return request(url, method, data); 
}

const deleteAdmin = (appkey,admin_id) => {
    let url = `api/users/admin?appkey=${appkey}&user_id=${admin_id}`;
    let method = "DELETE";
    return request(url, method);
}

const getOffers = (offer_id) => {
    let url = `api/offers?${offer_id}`
    return request(url);
}

const getItems = (data = {}) => {
    let params = 0;
    for(key in data){
        params++
    }
    let appkey = `${typeof(data.appkey) !== "undefined" ? params > 1 ? "&appkey="+data.appkey : "appkey="+data.appkey : ""}`;
    let url = `api/items${params > 0 ? "?" : ""}${appkey}`;
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
const deleteItem = (appkey, item_id) => {
    let url = `api/items?appkey=${appkey}&id=${item_id}`;
    let method = 'DELETE'
    return request(url, method);
}

const addPoint = (data = {}) => {
    let url = "api/users/addpoint";
    let method = "POST";
    return request(url, method, data);
}

const getHistoryPoint = (data = {}) => {
    let params = 0;
    for(key in data){
        params++;
    }
    let appkey = `${typeof(data.appkey) !== "undefined" ? params > 1 ? "&appkey="+data.appkey : "appkey="+data.appkey : ""}`;
    let id = `${typeof(data.id) !== "undefined" ? params > 1 ? "&id="+data.id : "id="+data.id : ""}`;
    let user_id = `${typeof(data.user_id) !== "undefined" ? params > 1 ? "&user_id="+data.user_id : "user_id="+data.user_id : ""}`;
    let limit = `${typeof(data.limit) !== "undefined" ? params > 1 ? "&limit="+data.limit : "limit="+data.limit : ""}`;
    let offset = `${typeof(data.offset) !== "undefined" ? params > 1 ? "&offset="+data.offset : "offset="+data.offset : ""}`;
    let url = `api/history/point${params > 0 ? "?" : ""}${appkey}${id}${limit}${offset}${user_id}`;
    return request(url);
}

const getHistoryRedeem = (data = {}) => {
    let params = 0;
    for(key in data){
        params++;
    }
    let appkey = `${typeof(data.appkey) !== "undefined" ? params > 1 ? "&appkey="+data.appkey : "appkey="+data.appkey : ""}`;
    let url = `api/history/redeem${params > 0 ? "?" : ""}${appkey}`;
    return request(url);
}

const updateRedeemStatus = (data = {}) => {
    let url = "api/history/redeem_status";
    let method = "POST";
    return request(url, method, data);
}
const updateJackpotStatus = (data = {}) => {
    let url = "api/history/jackpot_status";
    let method = "POST";
    return request(url, method, data);
}

const userImportExcel = (data = {}) => {
    let url = "api/users/import_excel";
    let method = "POST"
    return request(url, method, data, true);
}

const getSpinnerProbsData  = (data = {}) => {
    let params = 0;
    for(key in data){
        params++
    }
    let appkey = `${typeof(data.appkey) !== "undefined" ? params > 1 ? "&appkey="+data.appkey : "appkey="+data.appkey : ""}`;
    let admin = `${typeof(data.admin) !== "undefined" ? params > 1 ? "&admin="+data.admin : "admin="+data.admin : ""}`;
    let id = `${typeof(data.id) !== "undefined" ? params > 1 ? "&id="+data.id : "id="+data.id : ""}`;
    let path = `api/spinner/probs${params > 0 ? '?' : ""}${appkey}${admin}${id}`;

    return request(path);
}

const getSpinnerSettingData  = (data = {}) => {
    let params = 0;
    for(key in data){
        params++
    }
    let appkey = `${typeof(data.appkey) !== "undefined" ? params > 1 ? "&appkey="+data.appkey : "appkey="+data.appkey : ""}`;
    let path = `api/spinner/show${params > 0 ? '?' : ""}${appkey}`;

    return request(path);
}

const addSpinnerProbsData = (data = {}) => {
    let path = "api/spinner/probs";
    let method = "POST";
    return request(path, method, data);
}

const updateSpinnerProbsData = (data = {}) => {
    let path = "api/spinner/probs";
    let method = "PUT";
    return request(path, method, data);
}

const updateSpinnerProbsSettingData = (data = {}) => {
    let path = "api/spinner/setting";
    let method = "PUT";
    
    return request(path, method, data);
}

const adminLogout = (data = {}) => {
    let path = "api/users/adminlogout";
    let method = "POST";

    return request(path, method, data);
}

const getDailySet = (data = {}) => {
    let params = 0;
    for(key in data){
        params++
    }
    let appkey = `${typeof(data.appkey) !== "undefined" ? params > 1 ? "&appkey="+data.appkey : "appkey="+data.appkey : ""}`;
    let path = `api/dailypoint/set${params > 0 ? '?' : ""}${appkey}`;

    return request(path);
}

const saveDailySet = (data = {}) => {
    let path = "api/dailypoint/set";
    let method = "POST";
    return request(path, method, data);
}

const changeProbsStatus = (data = {}) => {
    let path = "api/spinner/change_status";
    let method = "POST";

    return request(path, method, data)
}

const getBannerData = (data = {}) => {
    let params = 0;
    for(key in data){
        params++
    }
    let appkey = `${typeof(data.appkey) !== "undefined" ? params > 1 ? "&appkey="+data.appkey : "appkey="+data.appkey : ""}`;
    let path = `api/banner${params > 0 ? '?' : ""}${appkey}`;

    return request(path);
}

const deleteSpinnerProbs = (data = {}) => {
    let params = 0;
    for(key in data){
        params++
    }
    let appkey = `${typeof(data.appkey) !== "undefined" ? params > 1 ? "&appkey="+data.appkey : "appkey="+data.appkey : ""}`;
    let probs_id = `${typeof(data.probs_id) !== "undefined" ? params > 1 ? "&probs_id="+data.probs_id : "probs_id="+data.probs_id : ""}`;
    let path = `api/spinner/probs${params > 0 ? '?' : ""}${appkey}${probs_id}`;
    let method = "DELETE";
    return request(path,method);
}

const updateBannerSetting = (data = {}) => {
    let method = "POST";
    let path = 'api/banner';

    return request(path, method, data);
}

const searchPointHistory = (data = {}) => {
    let params = 0;
    for(key in data){
        params++
    }
    let appkey = `${typeof(data.appkey) !== "undefined" ? params > 1 ? "&appkey="+data.appkey : "appkey="+data.appkey : ""}`;
    let search = `${typeof(data.search) !== "undefined" ? params > 1 ? "&search="+data.search : "search="+data.search : ""}`;
    let path = `api/history/point_search${params > 0 ? '?' : ""}${appkey}${search}`;

    return request(path);
}
const getJackpotHistory = (data = {}) => {
    let params = 0;
    for(let key in data){
        params++;
    }
    let appkey = `${typeof(data.appkey) !== "undefined" ? params > 1 ? "&appkey="+data.appkey : "appkey="+data.appkey : ""}`;    
    let user_id = `${typeof(data.user_id) !== "undefined" ? params > 1 ? "&user_id="+data.user_id : "user_id="+data.user_id : ""}`;    
    let limit = `${typeof(data.limit) !== "undefined" ? params > 1 ? "&limit="+data.limit : "limit="+data.limit : ""}`;    
    let offset = `${typeof(data.offset) !== "undefined" ? params > 1 ? "&offset="+data.offset : "offset="+data.offset : ""}`;    
    let id = `${typeof(data.id) !== "undefined" ? params > 1 ? "&id="+data.id : "id="+data.id : ""}`;    
    let path = `api/history/jackpot${params > 0 ? "?" : "" }${appkey}${id}${user_id}${limit}${offset}`;
    return request(path)
}

const API  = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    loginAdmin,
    adminLogout,
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
    userImportExcel,
    updateJackpotStatus,
    getSpinnerProbsData,
    addSpinnerProbsData,
    updateSpinnerProbsData,
    getSpinnerSettingData,
    updateSpinnerProbsSettingData,
    getDailySet,
    saveDailySet,
    changeProbsStatus,
    getBannerData,
    updateBannerSetting,
    deleteSpinnerProbs,
    searchPointHistory,
    getJackpotHistory,
    getAdmin,
    createAdmin,
    updateAdmin,
}

export default API;