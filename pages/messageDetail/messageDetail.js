// pages/message/message.js
var wxbarcode = require('../../utils/barqrcode.js')
Page({
  data:{
    showLoading: false,
    beneficiary: "旺记蔬菜批发行",
    state: "已逾期",
    version: "IOU_20170520",
    transactionDate: "2017-04-16",
    refundDate: "2017-05-15",
    cycle: "1个月",
    fee: "1 元",
    amount: "869 元",
    interestAmount: "无",
    goodsInfo: "无",
    drawer: "张三",
    guarantee: "担保3个月 逾期费1元/天",
    url:'',
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var id = options.id;
    wxbarcode.qrcode('qrcode', 'https://admin.accemarket.com/html/loanOrder/'+this.data.url+'.html', 340, 340);

  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})