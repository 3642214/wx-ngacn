// pages/forum/forum.js

const app = getApp()
let util = require('../../utils/util.js');
let api = require('../../utils/api.js');


import {
    $wuxDialog
  } from '../../miniprogram_npm/wux-weapp/index'
  

Page({

    /**
     * 页面的初始数据
     */
    data: {
        favorFroumList: [],
        dialog: null,
        tabs: [{
                key: 'favor',
                title: '我的收藏',
            },
            {
                key: 'other',
                title: 'other',
            }
        ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.fresh();
    },


    onShow: function () {
        let self = this;
        if (!app.globalData.cookie) {
            self.data.dialog = $wuxDialog().open({
                maskClosable: false,
                resetOnClose: true,
                zIndex: 0,
                title: '提示',
                content: '先登陆ngacn',
                buttons: [{
                    text: '转登录页',
                    type: 'primary',
                    onTap(e) {
                        wx.navigateTo({
                            url: '../personal/login',
                        })
                    }
                }, ],
            })
        } else {
            if (self.data.dialog) {
                self.data.dialog();
                self.data.dialog = null;
            }
            self.fresh();
        }
    },
    fresh() {
        let self = this;
        util.sendTextGet(api.APP_API_URL, {
            __lib: 'favorforum',
            __act: 'sync',
            noprefix: 0
        }).then(res => {
            console.log(JSON.stringify(res));
            self.setData({
                favorFroumList: res.result
            })
        }).catch(ret => {
            util.showErrToast(JSON.stringify(ret));
        });
    },
    click(e) {
        console.log(e.currentTarget.dataset.item.name)
        wx.navigateTo({
            url: `../index/index?fid=${e.currentTarget.dataset.item.fid}}&title=${e.currentTarget.dataset.item.name}`,
        })
    }

})