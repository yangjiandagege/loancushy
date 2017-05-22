var requestUtil = require('../utils/requestUtil');
var config = require('../config');

module.exports = {
  requestFrdList: requestFrdList,
  addFriend: addFriend,
  addBenefit: addBenefit,
  requestBenefitList: requestBenefitList,
  queryUser: queryUser,
  deleteBenefit: deleteBenefit,
  deleteFriend: deleteFriend,
  setDefaultBenefit: setDefaultBenefit
}

// 获取好友列表
function requestFrdList(callBack) {
  var business = {
    "atUserId": getApp().user.atUserId,
  }
  requestUtil.request(config.serviceCode.REQUEST_FRD_LIST, business, function (isSuccess, result, returnCode, returnMsg) {
    if (isSuccess) {
      callBack(isSuccess, result);
    } else {
      callBack(isSuccess, returnMsg)
      wx.showModal({
        title: "错误",
        content: returnMsg,
        confirmText: "确定",
        showCancel: false,
      })
    }
  }, config.config.friendUrl);
}

// 添加好友
function addFriend(fDesUser) {
  var business = {
    "fSrcUser": getApp().user.atUserId,
    "fDesUser": fDesUser
  }
  requestUtil.request(config.serviceCode.ADD_FRIEND, business, function (isSuccess, result, returnCode, returnMsg) {
    if (isSuccess) {
      wx.showModal({
        title: "提示",
        content: "建立好友关系成功",
        confirmText: "确定",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack({})
          }
        }
      })
    } else {
      wx.showModal({
        title: "错误",
        content: returnMsg,
        confirmText: "确定",
        showCancel: false,
      })
    }
  }, config.config.friendUrl);
}

// 添加受益人
function addBenefit(benefitId) {
  var business = {
    "atUserId": getApp().user.atUserId,
    "benefitId": benefitId,
    "benefitType": "30"
  }
  requestUtil.request(config.serviceCode.ADD_BENEFIT, business, function (isSuccess, result, returnCode, returnMsg) {
    if (isSuccess) {
      wx.showModal({
        title: "提示",
        content: "建立受益人关系成功",
        confirmText: "确定",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack({})
          }
        }
      })
    } else {
      wx.showModal({
        title: "错误",
        content: returnMsg,
        confirmText: "确定",
        showCancel: false,
      })
    }
  }, config.config.benefitUrl);
}

// 获取受益人列表
function requestBenefitList(callBack) {
  var business = {
    "atUserId": getApp().user.atUserId,
  }
  requestUtil.request(config.serviceCode.REQUEST_BENEFIT_LIST, business, function (isSuccess, result, returnCode, returnMsg) {
    if (isSuccess) {
      callBack(isSuccess, result);
    } else {
      callBack(isSuccess, returnMsg)
      wx.showModal({
        title: "错误",
        content: returnMsg,
        confirmText: "确定",
        showCancel: false,
      })
    }
  }, config.config.benefitUrl);
}

// 获取用户详情
function queryUser(phoneNum, callBack) {
  var business = {
    "phoneNum": phoneNum,
  }
  requestUtil.request(config.serviceCode.QUERY_USER, business, function (isSuccess, result, returnCode, returnMsg) {
    if (isSuccess) {
      callBack(isSuccess, result)
    } else {
      callBack(isSuccess, returnMsg)
      wx.showModal({
        title: "错误",
        content: returnMsg,
        confirmText: "确定",
        showCancel: false,
      })
    }
  }, config.config.friendUrl);
}

// 删除受益人
function deleteBenefit(benefitId) {
  var business = {
    "atUserId": getApp().user.atUserId,
    "benefitId": benefitId
  }
  requestUtil.request(config.serviceCode.DELETE_BENEFIT, business, function (isSuccess, result, returnCode, returnMsg) {
    if (isSuccess) {
      wx.showModal({
        title: "提示",
        content: "删除受益人成功",
        confirmText: "确定",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack({})
          }
        }
      })
    } else {
      wx.showModal({
        title: "错误",
        content: returnMsg,
        confirmText: "确定",
        showCancel: false,
      })
    }
  }, config.config.benefitUrl);
}

// 删除好友
function deleteFriend(friendId) {
  var business = {
    "fSrcUser": getApp().user.atUserId,
    "fDesUser": benefitId
  }
  requestUtil.request(config.serviceCode.DELETE_FRIEND, business, function (isSuccess, result, returnCode, returnMsg) {
    if (isSuccess) {
      wx.showModal({
        title: "提示",
        content: "删除好友成功",
        confirmText: "确定",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack({})
          }
        }
      })
    } else {
      wx.showModal({
        title: "错误",
        content: returnMsg,
        confirmText: "确定",
        showCancel: false,
      })
    }
  }, config.config.friendUrl);
}

// 设定默认受益人
function setDefaultBenefit(benefitId, callBack) {
  wx.showLoading({
    title: '设置中...',
    mask: true,
  })
  var business = {
    "atUserId": getApp().user.atUserId,
    "benefitId": benefitId
  }
  requestUtil.request(config.serviceCode.SET_DEFAULT_BENEFIT, business, function (isSuccess, result, returnCode, returnMsg) {
    wx.hideLoading();
    callBack(isSuccess);
    wx.showToast({
      title: isSuccess ? '设置默认受益人成功' : '设置失败',
      duration: 2000,
      icon: 'fail'
    })
  }, config.config.benefitUrl);
}

// 获取默认收益人
function queryDefaultBenefit(callBack) {
  requestBenefitList(function f(isSuccess, result) {
    if (isSuccess) {
      var index = -1;
      for (var i = 0, length = result.length; i < length; i++) {
        if (result[i].isDefualt == 1) {
          index = i;
          break;
        }
      }
      if (i < 0) {
        wx.showToast({
          title: '默认受益人获取失败',
          duration: 2000,
          icon: 'fail'
        });
      } else {
        callBack(result[i]);
      }
    } else {
      wx.showToast({
        title: '默认受益人获取失败',
        duration: 2000,
        icon: 'fail'
      })
    }
  })
}