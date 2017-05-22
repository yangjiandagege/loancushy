// pages/message/message.js
var requestUtil = require('../../utils/requestUtil.js')
var config = require('../../config.js');
var userModel = require('../../model/userModel');
var messageModel = require('../../model/messageModel');

Page({
  data: {
    showLoading: true,
    list: null
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.loadMessageList();
  },
  onReady: function () {
    // 页面渲染完111
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  onPullDownRefresh: function () {
    this.loadMessageList();
  },
  loadMessageList: function () {
    var self = this;
    messageModel.getMessageList(function callBack(isSuccess, result) {
      self.setData({
        showLoading: false
      })
      wx.stopPullDownRefresh()
      if (isSuccess) {
        self.setData({
          list: result
        })
      }
    });
  }
})