let util = require('./utils/util.js')
let api = require('./utils/api.js')

App({
    onLaunch: function () {
        let self = this;

        let cookie = wx.getStorageSync('userInfo');
        if (cookie) {
            self.globalData.cookie = cookie;
        }


    },
    globalData: {
        cookie: '',
    },
})