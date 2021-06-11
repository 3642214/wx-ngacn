// pages/index/addTZ.js

import {
    $wuxForm
} from '../../miniprogram_npm/wux-weapp/index'
const app = getApp();
let util = require('../../utils/util.js');
let api = require('../../utils/api.js');
let encoding = require('../../utils/decode.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        fid: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.fid) {
            this.setData({
                fid: options.fid
            })
        }
        console.log(JSON.stringify(this.data))
    },
    formSubmit() {
        let self = this;
        const {
            getFieldsValue,
            getFieldValue,
            setFieldsValue
        } = $wuxForm();
        const value = getFieldsValue();

        // console.log('Wux Form Submit \n', value, self.data.fid)

        if (!value.title) {
            util.showErrToast("必须输入标题");
            return;
        }

        if (!value.des || value.des.length <= 6) {
            util.showErrToast("必须输入内容，且长度大于6");
            return;
        }

        util.sendTextPost(`${api.POST_URL}?${util.dict2String({
            action: "new",
            fid: self.data.fid,
            post_subject:util.str2GBKUrlEncode(value.title),
            post_content:util.str2GBKUrlEncode(value.des),
            __output:14,
            step:2
        })}`, {}).then(res => {
            console.log(`${JSON.stringify(res)}`);
        }).catch(ret => {
            if (ret.msg.indexOf('发贴完毕') != -1) {
                util.showSuccToast(ret.msg, function () {
                    util.prePageReload(true);
                    wx.navigateBack();
                });
            } else {
                util.showErrToast(ret.msg);
            }
        });
    }
})