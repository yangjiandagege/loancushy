var config = require('../../../config.js');
var requestUtil = require('../../../utils/requestUtil');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputContent: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  jobInfoInput: function (e) {
    this.data.inputContent = e.detail.value;
  },

  saveTap: function(e){
    var self = this;
    var business = {
      "atUserId": getApp().user.atUserId,
      "remarks": self.data.inputContent,
    }
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    requestUtil.request(config.serviceCode.MODIFY_USER_INFO, business, function (isSuccess, result, returnCode, returnMsg) {
      wx.hideToast();
      if (isSuccess) {
        getApp().user.remarks = self.data.inputContent;
        wx.navigateBack();
      } else {
        wx.showModal({
          title: "错误",
          content: returnMsg,
          confirmText: "确定",
          showCancel: false,
        })
      }
    }, config.config.userServiceUrl);
  }
})