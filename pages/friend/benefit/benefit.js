
var friendModel = require('../../../model/friendModel');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSelect: false,
    list: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isSelect: options.isSelect
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var self = this;
    var myList = this.data.list;
    friendModel.requestBenefitList(function callBack(isSuccess, datas) {
      if (isSuccess) {
        self.setData({
          list: datas
        })
      }
    });
  },

  setDefaultBenefit: function (e) {
    var self = this;
    var myList = self.data.list;
    console.log(e);
    if (myList[e.target.id].isDefault == 1) {
      self.setData({
        list: myList
      })
    } else {
      friendModel.setDefaultBenefit(myList[e.target.id].userId, function callBack(isSuccess) {
        if (isSuccess) {
          for (var i = 0, length = myList.length; i < length; i++) {
            myList[i].isDefault = ((e.target.id == i) ? '1' : '0');
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
  },

  clickBenefit: function (e) {
    console.log(e);
    var id = e.currentTarget.id;
    console.log(id);
    var self = this;
    if (self.data.isSelect) {
      wx.navigateBack({

      })
      var pages = getCurrentPages();
      var myIouInfo = pages[pages.length - 2].data.iouInfo;
      myIouInfo.receiptorName = self.data.list[id].realName;
      myIouInfo.receiptorPhoneNum = self.data.list[id].phoneNum;
      myIouInfo.receiptorId = self.data.list[id].userId;
      pages[pages.length - 2].setData({
        iouInfo: myIouInfo
      })
    } else {
      wx.navigateTo({
        url: '../friendDetail/friendDetail?phoneNum=' + self.data.list[id].phoneNum,
      })
    }
  }
})