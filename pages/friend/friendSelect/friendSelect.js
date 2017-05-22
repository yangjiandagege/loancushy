var requestUtil = require('../../../utils/requestUtil');
var config = require('../../../config');
Page({
    data: {
        friendList:[],
        list: [
            {
                id: 'channel',
                name: '上游渠道',
                open: false,
                person: [
                ]
            },
            {
                id: 'customer',
                name: '下游客户',
                open: false,
                person: [
                ]
            },
            {
                id: 'favoree',
                name: '受益人',
                open: false,
                person: [
                ]
            }
        ]
    },

    onLoad: function (options) {
      var self = this;
      var business = {
        "atUserId": getApp().user.atUserId,
      }
      requestUtil.request(config.serviceCode.REQUEST_FRD_LIST, business, function (isSuccess, result, returnCode, returnMsg) {
        if (isSuccess) {
          self.data.friendList = result;
          for(var i = 0; i < result.length; i++){
            if (result[i].channelType == '10'){
              self.data.list[0].person.push(result[i]);
            } else if (result[i].channelType == '20'){
              self.data.list[1].person.push(result[i]);
            } else if (result[i].channelType == '30') {
              self.data.list[2].person.push(result[i]);
            }
          }
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

    kindToggle: function (e) {
      var id = e.currentTarget.id, list = this.data.list;
      for (var i = 0, len = list.length; i < len; ++i) {
          if (list[i].id == id) {
              list[i].open = !list[i].open
          }
      }
      this.setData({
          list: list
      });
    },

    friendSelectTap: function (e) {
      var id = e.currentTarget.id;
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      var self = this;
      for (var i = 0; i < self.data.friendList.length; i++){
        if (id == self.data.friendList[i].userId){
          prevPage.data.iouInfo.debtorName = self.data.friendList[i].realName;
          prevPage.data.iouInfo.debtorId = self.data.friendList[i].userId;
          prevPage.data.iouInfo.debtorOpenId = self.data.friendList[i].openId;
          prevPage.setData({
            iouInfo: prevPage.data.iouInfo,
          });
        }
      }
      wx.navigateBack();
    }
});
