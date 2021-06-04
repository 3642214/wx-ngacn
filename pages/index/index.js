// index.js
// 获取应用实例
const app = getApp()
let util = require('../../utils/util.js');
let api = require('../../utils/api.js');

import {
  $wuxDialog
} from '../../miniprogram_npm/wux-weapp/index'

Page({
  data: {
    indexPage: 1,
    tzList: []
  },

  onLoad: function (options) {
    this.fresh();
  },
  fresh() {
    let self = this;
    if (app.globalData.cookie) {
      self.listTZ(self.data.indexPage).then(res => {
        self.setData({
          tzList: res
        })
      }).then(ret => {
        util.showErrToast(JSON.stringify(ret));
      })
    }
  },
  onShow() {
    if (!app.globalData.cookie) {
      $wuxDialog().open({
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
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let self = this;
    self.data.indexPage = 1;
    self.listTZ(self.data.indexPage).then(res => {
      self.setData({
        tzList: res
      })
    }).catch(ret => {
      util.showErrToast(ret.msg);
    });
    util.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let self = this;
    self.listTZ(++self.data.indexPage).then(res => {
      // console.log(JSON.stringify(self.data))
      self.setData({
        tzList: self.data.tzList.concat(res)
      })
      // console.log(JSON.stringify(self.data))
    }).catch(ret => {
      util.showErrToast(ret.msg);
    });
  },
  tzTap(e) {
    // console.log('e :' + JSON.stringify(e.target.dataset.item));
    let self = this;
    wx.navigateTo({
      url: `./detailTZ?tid=${JSON.stringify(e.target.dataset.item.tid)}`,
    })
  },
  listTZ(page) {
    let self = this;
    return new Promise(function (resolve, reject) {
      util.sendGet(api.LIST_TZ_URL, {
        fid: -7,
        page: page,
        lite: 'js',
        noprefix: 0
      }).then(res => {
        console.log(JSON.stringify(res));
        let newTzList = [];
        Object.values(res.__T).forEach(element => {
          newTzList.push(element)
        });
        resolve(newTzList);
      }).catch(ret => {
        reject(ret);
      });
    });
  }
})