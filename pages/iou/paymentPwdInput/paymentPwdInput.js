var requestUtil = require('../../../utils/requestUtil.js')
var config = require('../../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFocus:true,
    inputContent:'',
    inputLenght:0,
    secretKey:'',
    assurePercent:0,
    debtAmount:0,
    role:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      secretKey : options.secretKey,
      assurePercent : options.assurePercent,
      debtAmount : options.debtAmount,
    })

  },

  inputFocus: function (e){
    this.setData({
      isFocus: false
    })
  },

  inputBlur: function (e) {
    this.setData({
      isFocus: true
    })
  },

  payPwdInput: function (e) {
    this.data.inputContent = e.detail.value;
    this.data.inputLenght = e.detail.value.length;

    this.setData({
      inputLenght: this.data.inputLenght
    })

    if (this.data.inputLenght == 6){
      var self = this;
      var business = {
        "secretKey": self.data.secretKey,
        "sign": "0123456789",
      }
      wx.showToast({
        title: 'loading...',
        icon: 'loading'
      })
      requestUtil.request(config.serviceCode.CONFIRM_IOU, business, function (isSuccess, result, returnCode, returnMsg) {
        if (isSuccess) {
          wx.hideToast();
          wx.showModal({
            title: "成功",
            content: "操作成功，现已正式生成欠条！",
            confirmText: "确定",
            success: function(){
              wx.reLaunch({
                url: '../../index/index'
              })
            },
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