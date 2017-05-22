var userModel = require('../../model/userModel');

//获取应用实例
Page({

  data: {
    isLogin:false,
    user:{},
  },

  onLoad: function () {

  },

  onShow:function(){
    this.setData({
      isLogin:(getApp().user.atUserId == null?false:true),
      user:getApp().user,
    });
  },

  gotoRegisterTap: function (e) {
    wx.navigateTo({
      url: 'newRegister/newRegister',
    })
  },

  myInfoTap: function(e) {
    wx.navigateTo({
      url: 'myInfo/myInfo',
    })
  },

  pwdManageTap: function(e) {
    wx.navigateTo({
      url: 'handlePwdSelect/handlePwdSelect',
    })
  },

            //   var d = {
            //     "touser": getApp().user.openid,//self.data.iouInfo.debtorOpenId
            //     "template_id": "yu6LHphFaEzu7ovs_twPOqVY_PHXcweGGsZ6ybxByHw",
            //     "page": '../iouDetailUnconfirmed/iouDetailUnconfirmed?iouId=' + result.debtId + '&fromOth=0',
            //     "form_id": e.detail.formId,
            //     "data": {
            //       "keyword1": {
            //         "value": "339208499",
            //         "color": "#173177"
            //       },
            //       "keyword2": {
            //         "value": "2015年01月05日 12:30",
            //         "color": "#173177"
            //       },
            //       "keyword3": {
            //         "value": "粤海喜来登酒店",
            //         "color": "#173177"
            //       },
            //       "keyword4": {
            //         "value": "广州市天河区天河路208号",
            //         "color": "#173177"
            //       }
            //     },
            //     "emphasis_keyword": "keyword1.DATA"
            //   }

            //   wx.request({
            //     url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + getApp().user.accessToken,
            //     data: d,
            //     method: 'POST',
            //     success: function (res) {
            //       console.log("push msg");
            //       console.log(res);
            //     },
            //     fail: function (err) {
            //       console.log("push err")
            //       console.log(err);
            //     }
            //   });
            // }else{
            //   wx.showModal({
            //     title: "错误",
            //     content: returnMsg,
            //     confirmText: "确定",
            //     showCancel: false,
            //   })
})
