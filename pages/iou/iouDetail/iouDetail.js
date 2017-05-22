var requestUtil = require('../../../utils/requestUtil.js')
var config = require('../../../config.js');
var userModel = require('../../../model/userModel');
var wxbarcode = require('../../../utils/barqrcode.js');
var requestIouServiceCode;
var self;
Page({
  data:{
    iouId:'',
    iouInfo:{
    },
    isFromOth:false,
  },
  
  onLoad: function(options) {
    self = this;
    this.data.iouId = options.iouId;
    this.setData({
      isFromOth: (options.fromOth == '1') ? true : false,
    });

    this.requestIouDetail();
    // wxbarcode.qrcode('qrcode', 'https://wx.accecard.com/webchat/static/IOU.html?no=' + this.data.iouId, 240, 240);
  },

  onShow:function(){
    this.setData({
      isLogin:(getApp().user.atUserId == null?false:true),
      user:getApp().user,
    });
  },
  
  requestIouDetail: function () {
    var business = {
      "debtId": self.data.iouId,
    }
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    requestUtil.request(config.serviceCode.REQUEST_VALID_IOU_DETAIL, business, function (isSuccess, result, returnCode, returnMsg) {
      wx.hideToast();
      if (isSuccess) {
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
    }, config.config.iouUrl,config.config.initToken);
  },
})