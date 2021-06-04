// pages/index/detailTZ.js
const app = getApp()
let util = require('../../utils/util.js');
let api = require('../../utils/api.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        indexPage: 1,
        tid: null,
        rList: [],
        uDict: null
    },
    onLoad: function (options) {
        let self = this;
        console.log(JSON.stringify(options))
        if (options.tid) {
            self.setData({
                tid: JSON.parse(options.tid)
            });
        }
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let self = this;
        self.listReply(self.data.indexPage).then(res => {
            // console.log(JSON.stringify(res))
            self.setData({
                rList: res
            })

            // console.log(JSON.stringify(self.data.uDict))
        }).then(ret => {
            util.showErrToast(JSON.stringify(ret));
        })
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
    listReply(page) {
        let self = this;
        return new Promise(function (resolve, reject) {
            util.sendGet(api.GET_TZ_URL, {
                v2: '',
                noprefix: '',
                page: page,
                lite: 'js',
                tid: self.data.tid
            }).then(res => {

                self.setData({
                    uDict: res.__U
                })

                let newTzList = [];
                Object.values(res.__R).forEach(element => {
                    newTzList.push(element)
                });
                resolve(newTzList);
            }).catch(ret => {
                reject(ret);
            });
        });
    }
})