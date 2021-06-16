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
        uDict: null,
        hasMore: true
    },
    onLoad: function (options) {
        let self = this;
        console.log(JSON.stringify(options))
        if (options.tid) {
            self.setData({
                tid: JSON.parse(options.tid)
            });
        }
        if (options.title) {
            wx.setNavigationBarTitle({
                title: options.title,
            })
        }
        this.fresh();
    },
    fresh() {
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
        this.fresh();
        util.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let self = this;
        if (self.data.hasMore) {
            self.listReply(++self.data.indexPage).then(res => {
                // console.log(JSON.stringify(self.data))
                self.setData({
                    rList: self.data.rList.concat(res)
                })
                // console.log(JSON.stringify(self.data))
            }).catch(ret => {
                util.showErrToast(ret.msg);
            });
        }
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
                    hasMore: res.__R__ROWS == res.__R__ROWS_PAGE,
                    uDict: {...self.data.uDict,...res.__U}
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