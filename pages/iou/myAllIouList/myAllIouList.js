var requestUtil = require('../../../utils/requestUtil');
var config = require('../../../config');
var windowHeight = 0;
var self;
Page({
  data: {
    user: {},
    tabs: ['待还款', '已还款'],
    activeIndex: 0,
    sliderOffset: 0,

    scrollHeight: 0,
    noRepayIouList: [],
    loadStatus: 0,
  },

  onLoad: function (options) {
    self = this;
    self.data.role = options.role;
    if (self.data.role == 'r02') {
      wx.setNavigationBarTitle({
        title: '我的欠条（我是受益人）',
      })
      self.setData({
        tabs: ['待收款', '已收款'],
      })
    } else {
      wx.setNavigationBarTitle({
        title: '我的欠条（我是欠款人）',
      })
      self.setData({
        tabs: ['待还款', '已还款'],
      })
    }

    wx.getSystemInfo({
      success: function (res) {
        windowHeight = res.windowHeight;
        self.setData({
          sliderOffset: res.windowWidth / self.data.tabs.length * self.data.activeIndex,
          scrollHeight: windowHeight - 60,
        });
      }
    });
    self.loadMore();
  },

  tabClick: function (e) {
    self.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  //页面滑动到底部
  bindDownLoad: function () {
    self.loadMore();
  },

  // 请求数据
  loadMore: function () {
    if (self.data.activeIndex == 0) {
      var business = {
        "quType": self.data.role,
      }
      requestUtil.request(config.serviceCode.REQUEST_VALID_IOU_LIST, business, function (isSuccess, result, returnCode, returnMsg) {
        if (isSuccess) {
          if (result.length == 0) {
            self.data.loadStatus = 2;
          } else if (result.length < 8) {
            self.data.loadStatus = 1;
          } else {
            self.data.loadStatus = 0;
          }
          self.data.noRepayIouList = result;
          for (var i = 0; i < self.data.noRepayIouList.length; i++) {
            var s = self.data.noRepayIouList[i].createTime.replace('/-/g', "/");
            self.data.noRepayIouList[i].createTime = new Date(s).format('MM月dd日 HH:mm');
          }
          self.setData({
            noRepayIouList: result,
            loadStatus: self.data.loadStatus
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
  },
})