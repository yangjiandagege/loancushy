var requestUtil = require('../../../utils/requestUtil');
var config = require('../../../config');

Page({
  data: {
    inputShowed: false,
    inputVal: "",
    addFrdType: ""
  },

  onLoad: function (options) {
    this.data.addFrdType = options.addFrdType;
    console.log(this.data.addFrdType);
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  searchConfirm: function (e) {
    var self = this;
    var business = {
      "phoneNum": self.data.inputVal,
    }
    requestUtil.request(config.serviceCode.QUERY_USER, business, function (isSuccess, result, returnCode, returnMsg) {
      if (isSuccess) {
        wx.navigateTo({
          url: '../friendDetail/friendDetail?isForAddFriend=1&phoneNum=' + self.data.inputVal + '&addFrdType=' + self.data.addFrdType,
        })
      } else {
        wx.showModal({
          title: "错误",
          content: returnMsg,
          confirmText: "确定",
          showCancel: false,
        })
      }
    }, config.config.friendUrl);
  },
  addFriend: function (e) {
    var self = this;
    var business = {
      "phoneNum": self.data.inputVal,
    }
    requestUtil.request(config.serviceCode.QUERY_USER, business, function (isSuccess, result, returnCode, returnMsg) {
      if (isSuccess) {
        wx.navigateTo({
          url: '../friendDetail/friendDetail?isForAddFriend=1&phoneNum=' + self.data.inputVal,
        })
      } else {
        wx.showModal({
          title: "错误",
          content: returnMsg,
          confirmText: "确定",
          showCancel: false,
        })
      }
    }, config.config.friendUrl);
  }
});