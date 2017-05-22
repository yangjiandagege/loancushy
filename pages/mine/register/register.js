var userModel = require('../../../model/userModel');
var config = require('../../../config.js');
var requestUtil = require('../../../utils/requestUtil');
var sendKey;
Page({
  data: {
    phoneNum: '',
    smsCode: '',
    realName: '',
    setPwd: '',
    confirmPwd: '',
    smsPrompt: '获取验证码',
    countNum: 60,
  },

  phoneNumInput: function (e) {
    this.phoneNum = e.detail.value;
  },

  smsCodeInput: function (e) {
    this.smsCode = e.detail.value;
  },

  getSmsCodeButtonTap: function (e) {
    var self = this;
    sendKey = requestUtil.getTimestamp();

    userModel.getSms(self.phoneNum, sendKey, function(isSuccess, returnMsg){
      if(isSuccess){
        self.setData({
          disableGetSms: true
        });
        
        var timer = setInterval(function(){
          self.data.countNum --;
          if(self.data.countNum == 0){
            self.data.countNum = 60;
            clearInterval(timer);
            self.setData({
              smsPrompt: "获取验证码",
              disableGetSms: false
            });
          }else{
            self.setData({
              smsPrompt: self.data.countNum+"秒后重发"
            });
          }
        }, 1000);
      }else{
        wx.showModal({
          title: "错误",
          content: returnMsg,
          confirmText: "确定",
          showCancel: false,
        })
      }
    });
  },

  registerButtonTap: function (e) {
    var self = this
    self.setData({
      loading: true
    })

    userModel.bindWxOpenid(self.smsCode, self.phoneNum, sendKey, function(isSuccess, returnMsg){
      if(isSuccess){
        wx.showModal({
          title: "提示",
          content: self.realName + "，您的账号注册成功，将为您自动登录！",
          confirmText: "确定",
          showCancel: false,
          success: function(res){
            if(res.confirm){
              userModel.getUser(function (){
                  wx.request({
                    url: `https://api.weixin.qq.com/cgi-bin/token`,
                    data: {
                      grant_type: 'client_credential',
                      appid: config.config.appId,
                      secret: config.config.appSecret,
                    },

                    success: function(result) {
                      getApp().user.accessToken = result.data.access_token;
                      wx.navigateBack();
                    },

                    fail: function({errMsg}) {
                      wx.navigateBack();
                    }
                })
              });
            }
          }
        })
      }else{
        self.setData({
          loading: false
        })
        wx.showModal({
          title: "错误",
          content: returnMsg,
          confirmText: "确定",
          showCancel: false,
        })
      }
    });
  }
})