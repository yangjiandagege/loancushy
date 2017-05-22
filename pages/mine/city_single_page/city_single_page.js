import dataAPI from './addressData.js'
var config = require('../../../config.js');
var requestUtil = require('../../../utils/requestUtil');

Page({
  data: {
    provinceList: dataAPI.provinceList,
    provinceShowStatus: true,
    cityShowStatus: false,
    districtShowStatus: false,
    cityList: [],
    districtList: []
  },

  setProvice: function (e) {
    var index = parseInt(e.currentTarget.dataset.index) ? parseInt(e.currentTarget.dataset.index) : 0;
    console.log('选择省', index, this.data.provinceList[index]);
    wx.setStorageSync('addressProvice', this.data.provinceList[index])
    this.setData({
      provinceShowStatus: false,
      cityShowStatus: true,
      districtShowStatus: false,
      cityList: this.data.provinceList[index].children
    });
  },

  setCity: function (e) {
    var index = parseInt(e.currentTarget.dataset.index) ? parseInt(e.currentTarget.dataset.index) : 0;
    console.log('选择市', index, this.data.cityList[index]);
    wx.setStorageSync('addressCity', this.data.cityList[index])
    this.setData({
      provinceShowStatus: false,
      cityShowStatus: true,
      districtShowStatus: false,
      // districtList: this.data.cityList[index].children
    });
    var addressDetail = {};
    addressDetail.province = wx.getStorageSync('addressProvice').label;
    addressDetail.city = wx.getStorageSync('addressCity').label;

    var self = this;
    var business = {
      "atUserId": getApp().user.atUserId,
      "district": addressDetail.province + " " + addressDetail.city,
    }
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    requestUtil.request(config.serviceCode.MODIFY_USER_INFO, business, function (isSuccess, result, returnCode, returnMsg) {
      wx.hideToast();
      if (isSuccess) {
        getApp().user.district = addressDetail.province + " " + addressDetail.city;
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
  },
})