var config = require('../../../config.js');
var requestUtil = require('../../../utils/requestUtil');
var sendKey;
Page({
  data: {
    stepIndex: 1,
    user: {},
    smsCode:'',
    newPwd: '',
    newPwdAgain: '',
    smsPrompt: '获取验证码',
    countNum: 60,
  },

  onLoad: function (options) {
    this.setData({
      user: getApp().user,
    });
  },

  smsCodeInput: function (e) {
    this.data.smsCode = e.detail.value;
  },

  pwdInput: function (e) {
    this.data.newPwd = e.detail.value;
  },

  pwdAgainInput: function (e) {
    this.data.newPwdAgain = e.detail.value;
  },

  getSmsCodeButtonTap: function(e) {
    sendKey = requestUtil.getTimestamp();
    var self = this;
    var business = {
      "msgType": "sms",
      "registerNum": self.data.user.phoneNum,
      "sendKey": sendKey,
    }
    requestUtil.request(config.serviceCode.GET_SMS, business, function (isSuccess, result, returnCode, returnMsg) {
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
      } else{
        wx.showModal({
          title: "错误",
          content: returnMsg,
          confirmText: "确定",
          showCancel: false,
        })
      }
    }, config.config.smsUrl, config.config.initToken);
  },

  verifySmsCodeTap: function (e){
    var self = this;
    var business = {
      "msgType": "sms",
      "phoneNum": self.data.user.phoneNum,
      "sendKey": sendKey,
      "atUserId": self.data.user.atUserId,
      "code": self.data.smsCode,
    }
    requestUtil.request(config.serviceCode.VERIFY_SMS_CODE, business, function (isSuccess, result, returnCode, returnMsg) {
      if (isSuccess) {
        wx.showModal({
          title: "提示",
          content: "验证成功，请您进行下一步！",
          confirmText: "下一步",
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              self.setData({
                stepIndex:2
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
    }, config.config.accountUrl);
  },

  setNewPwdConfirmTap: function(e){
    var self = this;
    if (self.data.newPwd != self.data.newPwdAgain) {
      wx.showModal({
        title: "提示",
        content: "对不起，两次输入密码不一致，请检查！",
        confirmText: "我知道了",
        showCancel: false,
      })
    } else if (self.data.newPwd.length != 6) {
      wx.showModal({
        title: "提示",
        content: "请输入6位数字密码！",
        confirmText: "我知道了",
        showCancel: false,
      })
    } else {
      var business = {
        "atUserId": getApp().user.atUserId,
        "npwd": self.data.newPwd,
        "cpwd": self.data.newPwdAgain,
      }
      wx.showToast({
        title: '加载中...',
        icon: 'loading'
      })
      requestUtil.request(config.serviceCode.SET_NEW_PAY_PWD, business, function (isSuccess, result, returnCode, returnMsg) {
        wx.hideToast();
        if (isSuccess) {
          wx.showModal({
            title: "提示",
            content: "恭喜您，修改融亿账户密码成功！",
            confirmText: "确定",
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({})
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
      }, config.config.accountUrl);
    }
  }
})