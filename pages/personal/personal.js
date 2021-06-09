// pages/personal/personal.js

const app = getApp()
let util = require('../../utils/util.js');
let api = require('../../utils/api.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: null,
        avatar: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {


    },
    onShow() {
        this.fresh();
    },
    fresh() {
        let self = this;
        if (app.globalData.cookie) {
            util.sendTextGet(`${api.NUKE_URL}`, {
                __lib: 'ucp',
                __output: '14',
                __act: 'get',
                uid: util.getCookieUid()

            }).then(res => {
                self.setData({
                    userInfo: res.result[0]
                })
            }).catch(ret => {
                util.showErrToast(`${JSON.stringify(ret)}`)
            })
        }
    },
    go2login() {
        wx.navigateTo({
            url: './login',
        })
    }
})