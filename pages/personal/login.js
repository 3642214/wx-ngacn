// pages/personal/personal.js
const app = getApp()
let util = require('../../utils/util.js');
let api = require('../../utils/api.js');

import {
    $wuxForm
} from '../../miniprogram_npm/wux-weapp/index'


Page({

    /**
     * 页面的初始数据
     */
    data: {
        cookie: app.globalData.cookie,
        login_code_pic: null,
        randomCode: null,
        userCookie: null,
        tabs: [{
                key: 'token',
                title: 'token填写',
            },
            {
                key: 'passwd',
                title: '密码登录',
            }
        ],
        current: {
            key: 'token',
            title: 'token填写',
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.changeCode();
    },
    onTabsChange(e) {
        // console.log('onTabsChange', e)
        const {
            key
        } = e.detail

        let current = null;

        this.data.tabs.forEach(tab => {
            if (tab.key == key) {
                current = tab;
            }
        });

        this.setData({
            key,
            current: current,
        })

    },
    changeCode() {
        let self = this;
        self.setData({
            randomCode: Math.random()
        })

        util.getLoginCode(self.data.randomCode).then(res => {
            console.log(JSON.stringify(res))
            self.setData({
                login_code_pic: res.tempFilePath
            })
        }).catch(ret => {
            util.showErrToast(JSON.stringify(ret));
        })
    },
    onChange(e) {
        console.log(e.detail.value);
        this.setData({
            userCookie: e.detail.value
        });
    },
    save() {
        let self = this;

        if (self.data.userCookie.length == 0) {
            util.showErrToast("请填入token");
            return;
        }

        app.globalData.cookie = self.data.userCookie;
        util.sendTextGet(`${api.NUKE_URL}?__lib=noti&__output=14&__act=get_all`, {}).then(res => {
            console.log(JSON.stringify(res))
            if (res.result) {
                console.log("保存token成功");
                util.saveUserInfonToLocal(app.globalData.cookie);

                util.prePageReload(true);
                wx.navigateBack()
            }
        }).catch(ret => {
            util.showErrToast(`token错误：${JSON.stringify(ret)}`);
            app.globalData.cookie = "";
        })
    },
    submit() {
        let self = this;
        const {
            getFieldsValue,
            getFieldValue,
            setFieldsValue
        } = $wuxForm();
        const value = getFieldsValue();
        console.log(JSON.stringify(value))

        let argFlag = true;
        Object.keys(value).forEach(key => {
            if (!value[key] || value[key].length == 0) {
                util.showErrToast(`请输入${key}`)
                argFlag = false;
                return;
            }
        });
        if (!argFlag) return;

        util.sendTextPost(`${api.NUKE_URL}?__lib=login&__act=login&name=${value.username}&password=${value.password}&captcha=${value.code}&type=phone&__output=14&__inchst=UTF-8&rid=_${self.data.randomCode}`, {}).then(res => {
            console.log(`登录成功: ${JSON.stringify(res)}`);
            let uid = (res.result)[1];
            let token = (res.result)[2];
            console.log(`${uid}  ${token}`);
            app.globalData.cookie = `ngaPassportUid=${uid};ngaPassportCid=${token}`;
            util.saveUserInfonToLocal(app.globalData.cookie);

            util.prePageReload(true);
            wx.navigateBack()
        }).catch(ret => {
            util.showErrToast(JSON.stringify(ret));
        })
    }
})