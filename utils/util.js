const httpsServerHost = "https://ngabbs.com";
import pro from 'minapp-promise';
let encoding = require('./decode.js');


function obj2List(obj) {
    let list = [];
    Object.keys(obj).forEach(key => {
        return list.push({
            value: key,
            label: obj[key]
        })
    });
    return list;
}

function parseQueryString(url) {
    let obj = {};
    let keyvalue = [];
    let key = "",
        value = "";
    let paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    for (let i in paraString) {
        keyvalue = paraString[i].split("=");
        key = keyvalue[0];
        value = keyvalue[1];
        obj[key] = value;
    }
    return obj;
}

//父列表页刷新
function prePageReload(hasFresh) {
    let pages = getCurrentPages();
    if (pages.length > 1) {
        let prePage = pages[pages.length - 2];
        //thisId即为当前项的id；
        if (hasFresh) {
            prePage.fresh();
        } else {
            prePage.onLoad();
        }
    }
}

function showSuccToast(msg, completeCB) {
    wx.showToast({
        title: msg,
        icon: 'none',
        image: '/static/toast_y.png',
        duration: 2000,
        mask: true,
        complete: function () {
            if (completeCB) {
                setTimeout(
                    () => {
                        completeCB();
                    },
                    2000
                )
            }
        }
    });
}

function showErrToast(msg, completeCB) {
    wx.showToast({
        title: msg,
        icon: 'none',
        // image: '/static/toast_n.png',
        duration: 2000,
        mask: true,
        complete: function () {
            if (completeCB) {
                setTimeout(
                    () => {
                        completeCB();
                    },
                    2000
                )
            }
        }
    });
}

function isPhone(phone) {
    var myreg = /^[1][3-9][0-9]{9}$/;
    if (!myreg.test(phone)) {
        return false;
    } else {
        return true;
    }
}

function stopPullDownRefresh() {
    setTimeout(() => {
        wx.stopPullDownRefresh();
    }, 500);
}

function saveUserInfonToLocal(userInfo) {
    console.log(`更新token信息：${JSON.stringify(userInfo)}`);
    wx.setStorageSync('userInfo', userInfo);
}

function ymdToStr(obj) {
    return `${obj.year}-${obj.month}-${obj.day}`;
}

function getDayAfterDay(dateStr, num) {
    return moment(dateStr, "YYYY-MM-DD").add(num, "days").format('YYYY-MM-DD');
}


const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
};

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
};

function sendGet(url, data) {
    return sendRequest(url, 'GET', "arraybuffer", data);
}

function sendPost(url, data) {
    return sendRequest(url, 'POST', "arraybuffer", data);
}

function sendPut(url, data) {
    return sendRequest(url, 'PUT', "arraybuffer", data);
}

function sendTextPost(url, data) {
    return sendRequest(url, 'POST', 'text', data);
}

function sendTextGet(url, data) {
    return sendRequest(url, 'GET', 'text', data);
}


function sendRequest(url, method, responseType, data) {
    return new Promise(function (resolve, reject) {
        if (!url) {
            return;
        }
        url = httpsServerHost + url;

        // console.log(`url ${method} 请求: ${url} ,${JSON.stringify(data) } `);
        if (method == 'GET') {
            console.log(`curl -X ${method} ${url}?${dict2String(data)}`);
        } else {
            console.log(`curl -X ${method} --data "${dict2String(data)}" ${url}`);
        }

        wx.request({
            url,
            method,
            dataType: "json",
            responseType,
            data,
            timeout: 3000,
            header: {
                'cookie': `${getApp().globalData.cookie}`,
                'content-type': 'application/json'
            },
            success(res) {
                // console.log(res)
                let results;
                if (responseType == 'arraybuffer') {
                    let unit8Arr = new Uint8Array(res.data);
                    results = new encoding.TextDecoder('gbk').decode(res.data);
                    results = results.replace(/\t/g, '')
                    console.log(results)
                    results = JSON.parse(results);
                    results = results.data;
                } else {
                    results = res.data;

                    // console.log(results)
                    if (results.code != 0) {
                        reject(results)
                    }
                }
                console.log("请求成功", url, results);
                resolve(results);
            },
            fail(ret) {
                // 网络请求错误, 网络失败
                console.log("请求失败：", ret);
                reject(ret)
            }
        })





        // pro.request({
        //     url: url,
        //     method: method,
        //     dataType: "json",
        //     responseType,
        //     data: data,
        //     timeout: 3000,
        //     header: {
        //         'cookie': app.globalData.cookie,
        //         'content-type': 'application/json'
        //     }
        // }).then(res => {
        //     console.log(res)
        //     let results;
        //     if (responseType == 'arraybuffer') {
        //         let unit8Arr = new Uint8Array(res.data);
        //         results = new encoding.TextDecoder('gbk').decode(res.data);
        //         results = results.replace(/\t/g, '')
        //         console.log(results)
        //         results = JSON.parse(results);
        //     } else {
        //         results = res.data;

        //         // console.log(results)
        //         if (results.code != 0) {
        //             reject(results)
        //         }
        //     }
        //     console.log("请求成功", url, results);
        //     resolve(results);
        // }).catch(res => {
        //     // 网络请求错误, 网络失败
        //     console.log("请求失败：", res);
        //     reject(res)
        // })
    })
}

function dict2String(dict) {
    let str = '';
    for (let key in dict) {
        str += `${key}=${dict[key]}&`;
        // console.log(key + dict[key]);
    }
    return str.substr(0, str.length - 1);
}

function getNowTime() {
    return (new Date()).valueOf();
}

function getNowTimeStr() {
    let date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function getLoginCode(code, succ, fail) {
    let url = `http://183.134.74.185:2222/addReferer/login_check_code.php?id=_${code}`;
    console.log(url)
    return pro.downloadFile({
        url: url,
    });
}

function getCookieUid() {
    let str = getApp().globalData.cookie;
    if (str.length == 0) {
        return "";
    }

    let uid = str.match(/ngaPassportUid=(\S*);/);
    if (uid) {
        return uid[1];
    }

    uid = str.match(/ngaPassportUid=(\S*)$/)[1];
    return uid;
}

module.exports = {
    sendGet,
    sendPost,
    sendTextPost,
    sendTextGet,
    sendPut,
    saveUserInfonToLocal,
    formatTime,
    ymdToStr,
    getDayAfterDay,
    stopPullDownRefresh,
    isPhone,
    showSuccToast,
    showErrToast,
    prePageReload,
    parseQueryString,
    obj2List,
    getNowTime,
    getNowTimeStr,
    getLoginCode,
    getCookieUid,
}