var requestUtil = require('../../../utils/requestUtil.js')
var config = require('../../../config.js');
var userModel = require('../../../model/userModel');
var wxbarcode = require('../../../utils/barqrcode.js');
var self;
Page({
  data: {
    iouId: '',
    iouInfo: {
    },
    isFromOth: true,
  },

  onLoad: function (options) {
    self = this;
    this.data.iouId = options.iouId;

    this.requestIouDetail();
    wxbarcode.qrcode('qrcode', 'https://wx.accecard.com/webchat/iouManage/IOU.html?no=' + this.data.iouId, 340, 340);
  },

  onShow: function () {
    this.setData({
      isLogin: (getApp().user.atUserId == null ? false : true),
      user: getApp().user,
    });
  },

  onShareAppMessage: function () {
    return {
      title: getApp().user.realName + '给您发来一张融亿欠条',
      path: '/pages/iou/iouDetailUnconfirmed/iouDetailUnconfirmed?iouId=' + this.data.iouId + '&fromOth=1',
    }
  },

  sendIouTap: function () {
    if (wx.canIUse('button.open-type.share')) {

    } else {
      wx.showModal({
        title: "提示",
        content: "请点击右上角的【...】,转发该欠条给微信好友",
        confirmText: "确定",
        showCancel: false,
      })
    }
  },

  confirmIouTap: function () {
    if (getApp().user.atUserId == this.data.iouInfo.receiptorId) {
      wx.showModal({
        title: "提示",
        content: "您是该欠条受益人，不能确认该欠条",
        confirmText: "确定",
        showCancel: false,
      })
    } else if (getApp().user.atUserId == null) {
      wx.showModal({
        title: "提示",
        content: "您尚未注册，请先注册",
        confirmText: "确定",
        showCancel: true,
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../mine/newRegister/newRegister',
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '../paymentPwdInput/paymentPwdInput?secretKey=' + this.data.iouInfo.secretKey
        + "&assurePercent=" + this.data.iouInfo.assurePercent
        + "&debtAmount=" + this.data.iouInfo.debtAmount,
      })
    }
  },

  rejectIouTap: function (e) {
    wx.showModal({
      title: "提示",
      content: "您确认要作废改欠条吗？",
      confirmText: "确定",
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          var business = {
            "debtId": self.data.iouId,
          }
          wx.showToast({
            title: '加载中...',
            icon: 'loading'
          })
          requestUtil.request(config.serviceCode.REJECT_IOU, business, function (isSuccess, result, returnCode, returnMsg) {
            wx.hideToast();
            if (isSuccess) {
              wx.showModal({
                title: "操作成功",
                confirmText: "确定",
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    self.requestIouDetail();
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
          }, config.config.iouUrl);
        }
      }
    })
  },

  requestIouDetail: function () {
    var business = {
      "debtId": self.data.iouId,
    }
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    requestUtil.request(config.serviceCode.REQUEST_UNCONFIRMED_IOU_DETAIL, business, function (isSuccess, result, returnCode, returnMsg) {
      wx.hideToast();

      if (isSuccess) {
        if (result.receiptorId == getApp().user.atUserId || result.createUserId == getApp().user.atUserId) {
          self.data.isFromOth = false;
        } else {
          self.data.isFromOth = true;
          wx.hideShareMenu();
        }
        result.createTime = (result.createTime.split('.'))[0];
        self.setData({
          iouInfo: result,
          isFromOth: self.data.isFromOth
        })
      } else {
        wx.showModal({
          title: "错误",
          content: returnMsg,
          confirmText: "确定",
          showCancel: false,
        })
      }
    }, config.config.iouUrl, config.config.initToken);
  },
})