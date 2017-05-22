//app.js
var userModel = require('./model/userModel');
var config = require('./config');
App({
  onLaunch: function () {
    var self = this;
    userModel.getUser(function () {
      wx.request({
        url: `https://api.weixin.qq.com/cgi-bin/token`,
        data: {
          grant_type: 'client_credential',
          appid: config.config.appId,
          secret: config.config.appSecret,
        },

        success: function (result) {
          getApp().user.accessToken = result.data.access_token;
        },

        fail: function ({errMsg}) {

        }
      })
    });
  },

  user:{
    userInfo:{},
    openid:null,
    token:null,    
    thumbnail:null,
    atUserId:null,
    nickName:null,
    sex:null,
    phoneNum:null,
    realName:null,
    district:null,

    companyName:null,
    companyId:null,
    departmentId:null,
    departmentName:null,
    qrCode:null,
    remarks: null,

    accessToken:null,
  },


})