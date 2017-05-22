var requestUtil = require('../../../utils/requestUtil');
var config = require('../../../config');
var friendModel = require('../../../model/friendModel');
Page({
  data: {
    isForAddFriend: false,
    phoneNum: '',
    frdUserInfo: {},
    addFrdType: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.data.addFrdType = options.addFrdType;
    this.data.isForAddFriend = (options.isForAddFriend == '1');
    this.setData({
      isForAddFriend: this.data.isForAddFriend
    })
    var self = this;
    friendModel.queryUser(options.phoneNum, function callBack(isSuccess, result) {
      if (isSuccess) {
        self.setData({
          frdUserInfo: result
        });
      }
    })
  },
  onReady: function () {
    // 页面渲染完成
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

  sendIouTap: function () {
    wx.navigateTo({
      url: '/pages/iou/setIou/setIou?debtorName=' + this.data.frdUserInfo.realName + '&debtorId=' + this.data.frdUserInfo.userId + '&debtorOpenId=' + this.data.frdUserInfo.openId,
    })
  },

  addFrdTap: function () {
    if (this.data.addFrdType == "benefit_add_frd") {
      friendModel.addBenefit(this.data.frdUserInfo.userId);
    } else if (this.data.addFrdType == "friend_add_frd") {
      friendModel.addFriend(this.data.frdUserInfo.userId);
    }
  },

  deleteFrdTap:function(){
    if (this.data.addFrdType == "benefit_add_frd") {
      friendModel.deleteBenefit(this.data.frdUserInfo.userId);
    } else if (this.data.addFrdType == "friend_add_frd") {
      friendModel.deleteFriend(this.data.frdUserInfo.userId);
    }
  }
})