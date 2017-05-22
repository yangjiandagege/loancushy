var requestUtil = require('../utils/requestUtil');
var config = require('../config');

module.exports = {
  hasMessage: hasMessage,
  getMessageList: getMessageList
}

// 加载消息
function localMessageList(callBack) {
  var business = {
    "openId": getApp().user.atUserId
  }
  requestUtil.request(config.serviceCode.MESSAGE_LIST, business, function (isSuccess, result, returnCode, returnMsg) {
    if (isSuccess) {
      callBack(true, result);
    } else {
      callBack(false, result);
      console.log("加载失败");
    }
  }, config.config.messageUrl);
}

// 保存时间
function setNewMessageTime(res) {
  wx.setStorage({
    key: "newMessageTime",
    data: getFirstTime(res),
    success: function (successRes) {
    }
  })
}

// 获取时间
function getNewMessageTime(callBack) {
  wx.getStorage({
    key: 'newMessageTime',
    success: function (res) {
      callBack(res.data);
    },
    fail: function (res) {
      callBack(0);
    }
  })
}

// 获取最新一条消息的创建时间
function getFirstTime(datas) {
  if (datas instanceof Array && datas.length > 0) {
    return getTime(datas[0]);
  } else {
    return 0;
  }
}

function getTime(data) {
  return data.createTime.replace(/-/g, '').replace(/:/g, '').replace(/ /g, '').replace('.', '');
}

// 是否有新消息
function hasMessage(callBack) {
  localMessageList(function f1(isSuccess, result) {
    if (isSuccess) {
      getNewMessageTime(function f2(newMessageTime) {
        callBack(getFirstTime(result) > newMessageTime)
      });
    } else {
      callBack(false);
    }
  })
}

// 获取消息并保存最新的时间
function getMessageList(callBack) {
  localMessageList(function f1(isSuccess, result) {
    if (isSuccess) {
      setNewMessageTime(result);
      if (result instanceof Array && result.length > 0) {
        for (var i = 0, length = result.length; i < length; i++) {
          result[i].createTime = result[i].createTime.substring(5, 16);
        }
        callBack(true, result);
      } else {
        callBack(false, "数据为空");
      }
    } else {
      callBack(false, "加载失败");
    }
  });
}