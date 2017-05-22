var requestUtil = require('../../../utils/requestUtil');
var config = require('../../../config');
var friendModel = require('../../../model/friendModel');
Page({
  data: {
    list: [
      {
        id: 'benefit',
        name: '受益人',
        isAdd: true,
        open: false,
        length: 0,
        person: [
        ]
      },
      {
        id: 'channel',
        name: '上游渠道',
        isAdd: false,
        open: false,
        length: 2,
        person: [
          {
            realName: "张三",
            thumbnail: "http://wx.qlogo.cn/mmopen/vi_32/2ZveN2DmFoE0Z26YqfgWLFRexpkng0ayKJlct6zsk2FDTAd7ZiaVnv17IQAJ4icNyHtCB9pAjaQyXSmsvW9csibUw/0",
            iouCount: "3张",
            payCount: "200元"
          },
          {
            realName: "李四",
            thumbnail: "http://wx.qlogo.cn/mmopen/vi_32/2ZveN2DmFoE0Z26YqfgWLFRexpkng0ayKJlct6zsk2FDTAd7ZiaVnv17IQAJ4icNyHtCB9pAjaQyXSmsvW9csibUw/0",
            iouCount: "3张",
            payCount: "200元"
          }
        ]
      },
      {
        id: 'customer',
        name: '下游客户',
        isAdd: false,
        open: false,
        length: 2,
        person: [
          {
            realName: "张三",
            thumbnail: "http://wx.qlogo.cn/mmopen/vi_32/2ZveN2DmFoE0Z26YqfgWLFRexpkng0ayKJlct6zsk2FDTAd7ZiaVnv17IQAJ4icNyHtCB9pAjaQyXSmsvW9csibUw/0",
            iouCount: "3张",
            payCount: "200元"
          },
          {
            realName: "李四",
            thumbnail: "http://wx.qlogo.cn/mmopen/vi_32/2ZveN2DmFoE0Z26YqfgWLFRexpkng0ayKJlct6zsk2FDTAd7ZiaVnv17IQAJ4icNyHtCB9pAjaQyXSmsvW9csibUw/0",
            iouCount: "3张",
            payCount: "200元"
          }
        ]
      }
      // ,
      // {
      //   id: 'friend',
      //   name: '好友',
      //   isAdd: true,
      //   open: false,
      //   length: 0,
      //   person: [
      //   ]
      // }
    ]
  },

  onShow: function (options) {
    var self = this;
    var myList = this.data.list;
    // friendModel.requestFrdList(function callBack(isSuccess, datas) {
    //   if (isSuccess) {
    //     myList[3].length = datas.length;
    //     myList[3].person = datas;
    //     self.setData({
    //       list: myList
    //     })
    //   }
    // });
    friendModel.requestBenefitList(function callBack(isSuccess, datas) {
      if (isSuccess) {
        myList[0].length = datas.length;
        myList[0].person = datas;
        self.setData({
          list: myList
        })
      }
    });
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

  setDefaultBenefit: function (e) {
    var self = this;
    var myList = self.data.list;
    console.log(e);
    if (myList[0].person[e.target.id].isDefault == 1) {
      self.setData({
        list: myList
      })
    } else {
      friendModel.setDefaultBenefit(myList[0].person[e.target.id].userId, function callBack(isSuccess) {
        if (isSuccess) {
          for (var i = 0, length = myList[0].person.length; i < length; i++) {
            myList[0].person[i].isDefault = ((e.target.id == i) ? '1' : '0');
          }
          self.setData({
            list: myList
          })
        } else {
          self.setData({
            list: myList
          })
        }
      });
    }
  },

  addFriendTap: function (e) {
    console.log(e);
    var self = this;
    var id = e.currentTarget.id;
    wx.showActionSheet({
      itemList: ['输入手机号', '扫描二维码名片'],
      success: function (e) {
        if (e.tapIndex == 0) {
          wx.navigateTo({
            url: '../addFriend/addFriend?addFrdType=' + id,
          })
        } else if (e.tapIndex == 1) {
          wx.scanCode({
            success: function (res) {
              var resArray = res.result.split('-');
              if (resArray.length == 2 && resArray[0] == 'ADDUSER') {
                wx.navigateTo({
                  url: '../friendDetail/friendDetail?isForAddFriend=1&phoneNum=' + resArray[1] + '&addFrdType=' + id,
                })
              }
            },
            fail: function (res) {
              console.log("fail: " + res.result);
            }
          })
        }
      }
    })
  }
});
