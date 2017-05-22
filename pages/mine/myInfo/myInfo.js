var config = require('../../../config.js');
var requestUtil = require('../../../utils/requestUtil');

Page({
  data:{
    user:{},
  },

  onShow:function(){
    this.setData({
      user: getApp().user,
    });
  },
  
  sexChangeTap:function(e) {
    var self = this;
    wx.showActionSheet({
      itemList: ['男', '女'],
      success: function (e) {
        var sexTmp;
        if (e.tapIndex == 0){
          sexTmp = "男";
        } else if (e.tapIndex == 1){
          sexTmp = "女";
        }else {
          return;
        }
        var business = {
          "atUserId": getApp().user.atUserId,
          "sex": sexTmp,
        }
        wx.showToast({
          title: '加载中...',
          icon: 'loading'
        })
        requestUtil.request(config.serviceCode.MODIFY_USER_INFO, business, function (isSuccess, result, returnCode, returnMsg) {
          wx.hideToast();
          if (isSuccess) {
            getApp().user.sex = sexTmp;
            self.setData({
              user: getApp().user,
            });
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
  },

  districtTap:function(e){
    wx.navigateTo({
      url: '../city_single_page/city_single_page',
    })
  },

  editJobInfoTap:function(e){
    wx.navigateTo({
      url: '../editJobInfo/editJobInfo',
    })
  }
})