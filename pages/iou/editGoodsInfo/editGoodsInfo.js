// editGoodsInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputContent:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  
  },

  goodsInfoInput: function (e) {
    this.data.inputContent = e.detail.value;
  },

  saveTap: function (e) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    var self = this;
    prevPage.data.iouInfo.remarks = self.data.inputContent;
    prevPage.setData({
      iouInfo: prevPage.data.iouInfo
    });
    wx.navigateBack();
  }
})