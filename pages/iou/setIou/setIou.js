var requestUtil = require('../../../utils/requestUtil.js')
var config = require('../../../config.js');
var dateUtil = require('../../../utils/dateUtil.js')
Page({
  data:{
    iouInfo:{
      atUserId:null,
      sign:null,
      secretKey:null,
      debtType:null,
      assureType:null,
      debtAmount:0,
      procedureFee:0,
      assurePercent:0.2,
      assureAmount:0,
      effectiveDate:null,
      agreePayDate:null,
      overdueAssureDate:null,
      debtCycle:null,
      receiptorType:null,
      receiptorName:null,
      receiptorPhoneNum: null,
      receiptorId:null,
      debtorType:null,
      debtorName:null,
      debtorId: null, 
      debtorOpenId: null,
      remarks:"无",
    },

    debtCycles: ["10天","1个月","2个月","3个月"],
    debtCycleIndex: 1,

    assurePercentTitles: ["20%", "50%", "100%"],
    assurePercentValues: [0.2,   0.5,   1],
    assurePercentIndex: 0,
  },
  
  onLoad: function(options) {
    var timestamp = requestUtil.getTimestamp();
    this.data.iouInfo.atUserId = getApp().user.atUserId;
    this.data.iouInfo.sign = "123456789";
    this.data.iouInfo.secretKey = "123456789";
    this.data.iouInfo.debtType = 0;
    this.data.iouInfo.assureType = 0;
    this.data.iouInfo.debtCycle = 30;
    this.data.iouInfo.effectiveDate = dateUtil.getCurrentDate();
    this.data.iouInfo.agreePayDate = dateUtil.addDays(dateUtil.getCurrentDate(), 30);
    this.data.iouInfo.overdueAssureDate = dateUtil.addDays(this.data.iouInfo.agreePayDate, 90);
    this.data.iouInfo.receiptorType = 0;
    this.data.iouInfo.receiptorName = getApp().user.realName;
    this.data.iouInfo.receiptorPhoneNum = getApp().user.phoneNum;
    this.data.iouInfo.receiptorId = getApp().user.atUserId;
    this.data.iouInfo.debtorType = 0;
    this.data.iouInfo.debtorName = (options.debtorName == null ? "暂无" : options.debtorName);
    this.data.iouInfo.debtorId = options.debtorId;
    this.data.iouInfo.debtorOpenId = options.debtorOpenId;
    this.setData({
      iouInfo: this.data.iouInfo,
    });
  },

  setDebtorTap: function (e) {
    wx.navigateTo({
      url: '/pages/friend/friendSelect/friendSelect',
    })
  },

  valueInput: function (e) {
    this.data.iouInfo.debtAmount = e.detail.value;
    this.data.iouInfo.assureAmount = (this.data.iouInfo.debtAmount * this.data.iouInfo.assurePercent).toFixed(0);
    this.setHandingCharge();
  },

  tenDaysTap: function(e){
    this.setData({
      debtCycleIndex:0
    });
    this.setHandingCharge();
  },

  oneMonthTap: function(e){
    this.setData({
      debtCycleIndex:1
    });
    this.setHandingCharge();
  },

  towMonthTap: function(e){
    this.setData({
      debtCycleIndex:2
    });
    this.setHandingCharge();
  },

  threeMonthTap: function(e){
    this.setData({
      debtCycleIndex:3
    });
    this.setHandingCharge();
  },

  editGoodsTap: function (e) {
    wx.navigateTo({
      url: '../editGoodsInfo/editGoodsInfo',
    })
  },

  bindAssurePercentChange: function (e) {
    this.data.iouInfo.assurePercent = this.data.assurePercentValues[e.detail.value];
    this.data.iouInfo.assureAmount = (this.data.iouInfo.debtAmount * this.data.iouInfo.assurePercent).toFixed(0);
    this.setData({
      iouInfo:this.data.iouInfo,
      assurePercentIndex: e.detail.value
    })
  },

  submitTap: function(e){
    var self = this;
    var value = self.data.iouInfo.debtAmount;
    if (value==''){
      wx.showModal({
        title: "提示",
        content: "请输入金额！",
        confirmText: "确定",
        showCancel: false,
      })
    } else if ((parseFloat(value) < 100) || (parseFloat(value) > 5000)){
      wx.showModal({
        title: "提示",
        content: "对不起，融亿欠条金额只支持在100到5000之间，请您重新输入！",
        confirmText: "确定",
        showCancel: false,
      })
    }else{
      self.setData({
        loading: true
      })
      var business = {
          "atUserId": self.data.iouInfo.atUserId, 
          "sign": self.data.iouInfo.sign, 
          "secretKey": requestUtil.getTimestamp() , 
          "debtType": self.data.iouInfo.debtType,
          "assureType": self.data.iouInfo.assureType, 
          "debtAmount": self.data.iouInfo.debtAmount, 
          "effectiveDate": self.data.iouInfo.effectiveDate , 
          "debtCycle": self.data.iouInfo.debtCycle,
          "procedureFee": self.data.iouInfo.procedureFee,
          "assurePercent": self.data.iouInfo.assurePercent, 
          "assureAmount": self.data.iouInfo.assureAmount, 
          "agreePayDate": self.data.iouInfo.agreePayDate, 
          "overdueAssureDate": self.data.iouInfo.overdueAssureDate,
          "receiptorType": self.data.iouInfo.receiptorType, 
          "receiptorId": self.data.iouInfo.receiptorId , 
          "debtorType": self.data.iouInfo.debtorType,
          "debtorId": self.data.iouInfo.debtorId,
          "remarks": self.data.iouInfo.remarks,
        }

        requestUtil.request(config.serviceCode.CREATE_IOU, business, function(isSuccess, result, returnCode, returnMsg){
            self.setData({
              loading: false
            })
            if(isSuccess){
              wx.redirectTo({
                url: '../iouDetailUnconfirmed/iouDetailUnconfirmed?iouId=' + result.debtId + '&fromOth=0'//后台使用debt作为表名,我们使用的事iou
              })
            }else{
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

  bindAgreeChange: function (e) {
    this.setData({
        isAgree: !!e.detail.value.length
    });
  },

  setHandingCharge: function(){
    if(this.data.debtCycleIndex == 0){
        this.data.iouInfo.debtCycle = 10;
        this.data.iouInfo.agreePayDate = dateUtil.addDays(dateUtil.getCurrentDate(), 10);
        this.data.iouInfo.overdueAssureDate = dateUtil.addDays(this.data.iouInfo.agreePayDate, 90);
        this.data.iouInfo.procedureFee = 0;
    }else if(this.data.debtCycleIndex == 1){
        this.data.iouInfo.debtCycle = 30;
        this.data.iouInfo.agreePayDate = dateUtil.addDays(dateUtil.getCurrentDate(), 30);
        this.data.iouInfo.overdueAssureDate = dateUtil.addDays(this.data.iouInfo.agreePayDate, 90);
        this.data.iouInfo.procedureFee = Math.ceil(this.data.iouInfo.debtAmount/1000);
    }else if(this.data.debtCycleIndex == 2){
        this.data.iouInfo.debtCycle = 60;
        this.data.iouInfo.agreePayDate = dateUtil.addDays(dateUtil.getCurrentDate(), 60);
        this.data.iouInfo.overdueAssureDate = dateUtil.addDays(this.data.iouInfo.agreePayDate, 90);
        this.data.iouInfo.procedureFee = Math.ceil(this.data.iouInfo.debtAmount*2/1000);
    }else if(this.data.debtCycleIndex == 3){
        this.data.iouInfo.debtCycle = 90;
        this.data.iouInfo.agreePayDate = dateUtil.addDays(dateUtil.getCurrentDate(), 90);
        this.data.iouInfo.overdueAssureDate = dateUtil.addDays(this.data.iouInfo.agreePayDate, 90);
        this.data.iouInfo.procedureFee = Math.ceil(this.data.iouInfo.debtAmount*5/1000);
    }
    this.setData({
      iouInfo:this.data.iouInfo,
    })
  },

  selectBenepit: function (e) {
    console.log(e);
    wx.navigateTo({
      url: '../../friend/benefit/benefit?isSelect=true'
    })
  }
})