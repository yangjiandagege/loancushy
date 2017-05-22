// myQrcode.js
var wxbarcode = require('../../../utils/barqrcode.js');
Page({
  data:{
    qrcode:'',
    user:{}
  },
  onLoad:function(options){
    this.data.user = getApp().user,
    this.data.qrcode = "ADDUSER-"+getApp().user.phoneNum;
    wxbarcode.qrcode('qrcode', this.data.qrcode, 600, 600);
    this.setData({
      user: this.data.user,
    })
  },
  onReady:function(){
  },
  onShow:function(){
  },
  onHide:function(){
  },
  onUnload:function(){
  }
})