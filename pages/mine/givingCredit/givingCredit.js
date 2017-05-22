// var app = getApp();

Page({
  data: {
    stepIndex:1,
  },

  onLoad() {

  },

  onShow() {
  },

  idAuthTap: function(){
    this.setData({
      stepIndex:2
    })
  },

  bindBankcardTap: function(){
    this.setData({
      stepIndex:3
    })
  },

  setPwdConfirmTap: function(){
    wx.showModal({
          title: "提示",
          content: "融亿授信完成！",
          confirmText: "确定",
          showCancel: false,
          success: function(res){
          }
    })
  }
});
