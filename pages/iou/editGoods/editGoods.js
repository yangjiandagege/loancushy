Page({
  data:{
    goodsName:'',
    goodsSpec:'',
    goodsNum:0.0,
    goodsPrice:0.0,
    total:0.0
  },
  onLoad:function(options){
  },


  goodsNameInput: function(e){
    this.data.goodsName = e.detail.value;
  },

  goodsSpecInput: function(e){
    this.data.goodsSpec = e.detail.value;
  },

  goodsNumInput: function(e){
    this.data.goodsNum = e.detail.value;
    this.getTotal();
  },

  goodsPriceInput: function(e){
    this.data.goodsPrice = e.detail.value;
    this.getTotal();
  },

  confirmBtnTap: function(e){
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    var self = this;
    prevPage.data.iouInfo.remarks = "购买"+self.data.goodsName+"，共消费"+self.data.total+"元";
    prevPage.setData({
      iouInfo: prevPage.data.iouInfo
    });
    wx.navigateBack();
  },

  getTotal:function(){
    var self = this;
    self.setData({
      total : self.data.goodsNum * self.data.goodsPrice
    })
  }
})