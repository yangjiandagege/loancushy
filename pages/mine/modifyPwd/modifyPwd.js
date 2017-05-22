var config = require('../../../config.js');
var requestUtil = require('../../../utils/requestUtil');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldPwd:'',
    newPwd:'',
    newPwdAgain:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  oldPwdInput: function (e) {
    this.data.oldPwd = e.detail.value;
  },

  newPwdInput: function (e) {
    this.data.newPwd = e.detail.value;
  },

  newPwdAgainInput: function (e) {
    this.data.newPwdAgain = e.detail.value;
  },

  modifyPwdConfirmTap: function (e) {
    var self = this;
    if (self.data.newPwd != self.data.newPwdAgain){
      wx.showModal({
        title: "提示",
        content: "对不起，两次输入密码不一致，请检查！",
        confirmText: "我知道了",
        showCancel: false,
      })
    } else if (self.data.newPwd.length != 6){
      wx.showModal({
        title: "提示",
        content: "请输入6位数字密码！",
        confirmText: "我知道了",
        showCancel: false,
      })
    } else {
        var business = {
          "atUserId": getApp().user.atUserId,
          "accountPwd": self.data.newPwd,
          "oldAccountPwd": self.data.oldPwd,
        }
        wx.showToast({
          title: '加载中...',
          icon: 'loading'
        })
        requestUtil.request(config.serviceCode.MODIFY_ACCOUNT_PWD, business, function (isSuccess, result, returnCode, returnMsg) {
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