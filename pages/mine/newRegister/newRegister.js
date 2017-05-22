var userModel = require('../../../model/userModel');
var config = require('../../../config.js');
var requestUtil = require('../../../utils/requestUtil');
var sendKey;
Page({

  data: {
    stepIndex: 1,
    name: '',
    idNum: '',
    phoneNum: '',
    smsCode: '',
    realName: '',
    pwd: '',
    pwdAgin: '',
    smsPrompt: '获取验证码',
    countNum: 60,
  },

  onLoad: function (options) {
  
  },

  phoneNumInput: function (e) {
    this.phoneNum = e.detail.value;
  },

  smsCodeInput: function (e) {
    this.smsCode = e.detail.value;
  },

  nameInput: function (e) {
    this.data.name = e.detail.value;
  },

  idNumInput: function (e) {
    this.data.idNum = e.detail.value;
  },

  pwdInput: function (e) {
    this.data.pwd = e.detail.value;
  },

  pwdAginInput: function (e) {
    this.data.pwdAgin = e.detail.value;
  },

  getSmsCodeButtonTap: function (e) {
    var self = this;
    sendKey = requestUtil.getTimestamp();

    userModel.getSms(self.phoneNum, sendKey, function (isSuccess, returnMsg) {
      if (isSuccess) {
        self.setData({
          disableGetSms: true
        });

        var timer = setInterval(function () {
          self.data.countNum--;
          if (self.data.countNum == 0) {
            self.data.countNum = 60;
            clearInterval(timer);
            self.setData({
              smsPrompt: "获取验证码",
              disableGetSms: false
            });
          } else {
            self.setData({
              smsPrompt: self.data.countNum + "秒后重发"
            });
          }
        }, 1000);
      } else {
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

    userModel.bindWxOpenid(self.smsCode, self.phoneNum, sendKey, function (isSuccess, returnMsg) {
      if (isSuccess) {
        wx.showModal({
          title: "提示",
          content: "您的账号注册成功，请您进行下一步！",
          confirmText: "下一步",
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
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
                    self.setData({
                      stepIndex: 2,
                    })
                  },

                  fail: function ({errMsg}) {
                    
                  }
                })
              });
            }
          }
        })
      } else {
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
  },

  verificationTap: function (e) {
    var self = this;
    var business = {
      "atUserId": getApp().user.atUserId,
      "realName": self.data.name,
    }
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    requestUtil.request(config.serviceCode.MODIFY_USER_INFO, business, function (isSuccess, result, returnCode, returnMsg) {
      wx.hideToast();
      if (isSuccess) {
        getApp().user.realName = self.data.name;
        wx.showModal({
          title: "提示",
          content: "您已完成了身份验证，请您进行下一步！",
          confirmText: "下一步",
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              self.setData({
                stepIndex: 3,
              })
            }
          }
        })
      } else {
        wx.showModal({
          title: "错误",
          content: returnMsg,
          confirmText: "确定",
          showCancel: false,
        })
      }
    }, config.config.userServiceUrl);
  },

  setPwdConfirmTap: function (e) {
    var self = this;
    if (self.data.pwd != self.data.pwdAgin){
      wx.showModal({
        title: "提示",
        content: "对不起，两次输入密码不一致，请检查！",
        confirmText: "我知道了",
        showCancel: false,
      })
    }else{
      var business = {
        "atUserId": getApp().user.atUserId,
        "payPwd": self.data.pwd,
      }
      wx.showToast({
        title: '加载中...',
        icon: 'loading'
      })
      requestUtil.request(config.serviceCode.SET_PAY_PWD, business, function (isSuccess, result, returnCode, returnMsg) {
        wx.hideToast();
        if (isSuccess) {
          wx.navigateBack({})
        } else {
          wx.showModal({
            title: "错误",
            content: returnMsg,
            confirmText: "确定",
            showCancel: false,
          })
        }
      }, config.config.accountUrl);
    }
  }
})