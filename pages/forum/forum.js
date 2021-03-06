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
        util.sendTextPostWithHost('https://dx.emindt.cn:3333/addReferer',`${api.APP_API_URL}?${util.dict2String({
            __lib: 'favorforum',
            __act: 'sync'
        })}`, {}).then(res => {
            console.log(JSON.stringify(res));

            res.result.forEach(froum => {
                froum.picStr = `https://images.weserv.nl/?url=http://img4.nga.178.com/ngabbs/nga_classic/f/app/${froum.fid}.png`
            });

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
            url: `../index/index?fid=${e.currentTarget.dataset.item.fid}&title=${e.currentTarget.dataset.item.name}`,
        })
    },
    checkIn() {
        util.sendTextGet(api.NUKE_URL, {
            __lib: 'check_in',
            __act: 'check_in',
            __output: 14
        }).then(res => {
            util.showSuccToast("签到成功");
            console.log(JSON.stringify(res));
        }).catch(ret => {
            util.showErrToast(JSON.stringify(ret));
        });
    },
    imageError(e) {
        let self = this;
        let index = e.currentTarget.dataset.index;
        // console.log(JSON.stringify(e))
        self.setData({
            [`favorFroumList[${index}].picStr`]: "/static/default.png"
        });
    }
})