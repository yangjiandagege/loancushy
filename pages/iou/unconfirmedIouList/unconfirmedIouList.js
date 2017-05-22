// pages/unconfirmedIouList/unconfirmedIouList.js
var requestUtil = require('../../../utils/requestUtil.js')
var config = require('../../../config.js');
var windowHeight = 0;
Page({
  data:{
    iouListForReceiptor:[],
    iouListForDebtor: [],
    tabs: ["待确认", "已作废"],
    activeIndex: 0,
    sliderOffset: 0,

    scrollHeight: 0,
  },

  onLoad:function(options){
    var self = this;
    wx.getSystemInfo({
      success: function (res) {
        windowHeight = res.windowHeight;
        self.setData({
          sliderOffset: res.windowWidth / self.data.tabs.length * self.data.activeIndex,
          scrollHeight: windowHeight - 60
        });
      }
    });
  },

  onShow:function(){
    var self = this;
    var business = {
      "quType": 'r02',
      "debtState": '0'
    }
    requestUtil.request(config.serviceCode.REQUEST_UNCONFIRMED_IOU_LIST, business, function (isSuccess, result, returnCode, returnMsg) {
      if (isSuccess) {
        console.log(result);
        self.data.iouListForReceiptor = result;
        for (var i = 0; i < self.data.iouListForReceiptor.length; i++) {
          var s = self.data.iouListForReceiptor[i].createTime.replace('/-/g', "/");
          self.data.iouListForReceiptor[i].createTime = new Date(s).format('yyyy-MM-dd');
        }
        self.setData({
          iouListForReceiptor: self.data.iouListForReceiptor
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

    var business = {
      "quType": 'r02',
      "debtState": '2'
    }
    requestUtil.request(config.serviceCode.REQUEST_UNCONFIRMED_IOU_LIST, business, function (isSuccess, result, returnCode, returnMsg) {
      if (isSuccess) {
        console.log(result);
        self.data.iouListForDebtor = result;
        for (var i = 0; i < self.data.iouListForDebtor.length; i++) {
          var s = self.data.iouListForDebtor[i].createTime.replace('/-/g', "/");
          self.data.iouListForDebtor[i].createTime = new Date(s).format('MM月dd日 HH:mm');
        }
        self.setData({
          iouListForDebtor: self.data.iouListForDebtor
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
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
})