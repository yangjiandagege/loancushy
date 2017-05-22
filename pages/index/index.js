var wxbarcode = require('../../utils/barqrcode.js');
var urlParseUtil = require('../../utils/util.js');
var userModel = require('../../model/userModel');
var messageModel = require('../../model/messageModel');
var requestUtil = require('../../utils/requestUtil.js')
var config = require('../../config.js');

Page({
  data: {
    user: {},
    iouList: [],
    imgUrls: [
      'http://120.76.241.240/image_index/img_ad_5.jpg',
      'http://120.76.241.240/image_index/img_ad_1.jpg',
      'http://120.76.241.240/image_index/img_ad_2.jpg',
      'http://120.76.241.240/image_index/img_ad_3.jpg',
      'http://120.76.241.240/image_index/img_ad_4.jpg',
      'http://120.76.241.240/image_index/img_ad_6.jpg',
    ],
    messageList: null,
    hasMessage: false
  },

  onShow: function () {
    this.hasMessage();
  },

  createTap: function (e) {
    if(getApp().user.realName != null){
      wx.navigateTo({
        url: '../iou/setIou/setIou',
      })
    }else{
      wx.showModal({
        title: "提示",
        content: "对不起，您还没有身份验证！",
        confirmText: "去验证",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../mine/idVerification/idVerification',
            })
          }
        }
      })
    }
  },

  qrScanTap: function (e) {
    wx.scanCode({
      success: function (res) {
        var resArray = res.result.split('=');
        var iouId = resArray[resArray.length - 1];
        wx.navigateTo({
          url: '../iou/iouDetailUnconfirmed/iouDetailUnconfirmed?iouId=' + iouId,
        })
      },
      fail: function (res) {
        console.log("fail: " + res.result);
      }
    })
  },

  myIousTap: function (e) {
    wx.navigateTo({
      url: '/pages/iou/roleSelect/roleSelect',
    })
  },

  messageTap: function (e) {
    wx.navigateTo({
      url: '../message/message',
    })
  },

  hasMessage: function () {
    var self = this
    messageModel.hasMessage(function callBack(isHas) {
      self.setData({
        hasMessage: isHas
      })
    });
  }
})
