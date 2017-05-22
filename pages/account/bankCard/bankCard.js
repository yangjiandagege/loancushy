// bankCard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankCardList:[
      {
        bankName:'中国民生银行',
        cardType:'储蓄卡',
        cardNum:'**** **** **** 5550',
        cardColor:'#018c77'
      },
      {
        bankName: '招商银行',
        cardType: '储蓄卡',
        cardNum: '**** **** **** 0428',
        cardColor: '#c75056'
      },
      {
        bankName: '交通银行',
        cardType: '储蓄卡',
        cardNum: '**** **** **** 1416',
        cardColor: '#1a66a4'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  addBankcardTap: function (e) {
    wx.navigateTo({
      url: '/pages/account/pwdInput/pwdInput',
    })
  }
})