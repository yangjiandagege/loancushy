var requestUtil = require('../utils/requestUtil');
var base64 = require('../utils/base64');
var serviceCode = require('../config').serviceCode;
var config = require('../config').config;

module.exports = {
    getUser:getUser,
    login: login,
    bindWxOpenid: bindWxOpenid,
    getSms: getSms,
}


// lazy loading openid
function getUser(setViewCallback) {
    wx.login({
        success: function(data) {
            wx.getUserInfo({
              success: function(res){
                getApp().user.userInfo = res.userInfo;
              }
            })

            wx.request({
                url: "https://api.weixin.qq.com/sns/jscode2session?appid="+config.appId+"&secret="+config.appSecret+"&js_code="+data.code+"&grant_type=authorization_code",
                data: {
                    code: data.code
                },
                success: function(res) {
                    getApp().user.openid = res.data.openid;
                    console.log('拉取openid成功', getApp().user.openid)
                    login(function(isSuccess, result, returnCode, returnMsg){
                        setViewCallback();
                    });
                },
                fail: function(res) {
                    console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
                }
            })
        },
        fail: function(err) {
            console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
        }
    })
}

function login(setViewCallback){
    var business = {
        "openId":getApp().user.openid,
        "loginType": "pro",
    }
    getApp().user.token = config.initToken;
    requestUtil.request(serviceCode.GET_TOKEN_BY_OPENID, business, function(isSuccess, result, returnCode, returnMsg){
        if(isSuccess){
            getApp().user.token = result.token;
            getApp().user.atUserId = result.atUserId;
            var business = {
                "atUserId":getApp().user.atUserId,
            }

            requestUtil.request(serviceCode.GET_USER, business, function(isSuccess, result, returnCode, returnMsg){
                if(isSuccess){
                    getApp().user.phoneNum = result.phoneNum;
                    getApp().user.realName = result.realName;
                    getApp().user.thumbnail = result.thumbnail;
                    getApp().user.nickName = result.nickName;
                    getApp().user.sex = result.sex;
                    getApp().user.companyName = result.companyName;
                    getApp().user.companyId = result.companyId;
                    getApp().user.departmentId = result.departmentId;
                    getApp().user.departmentName = result.departmentName;
                    getApp().user.qrCode = result.qrCode;
                    getApp().user.remarks = result.remarks;
                    getApp().user.district = result.district;
                }

                if(setViewCallback != null){
                    setViewCallback(isSuccess, returnMsg);
                }
            });

        }else{
            if(setViewCallback != null){
                setViewCallback(isSuccess, returnMsg);
            }
        }
    });
}

function getSms(registerNum, sendKey, setViewCallback){
    var business = {
        "msgType":"sms",
        "registerNum":registerNum,
        "sendKey": sendKey,
    }
    getApp().user.token = config.initToken;
    requestUtil.request(serviceCode.GET_SMS, business, function(isSuccess, result, returnCode, returnMsg){
        if(setViewCallback != null){
            setViewCallback(isSuccess, returnMsg);
        }
    }, config.smsUrl);
}

function bindWxOpenid(code, atUserId, sendKey, setViewCallback) {
    var business = {
        "loginType":"pro",
        "msgType":"sms",
        "code":code,
        "sendKey": sendKey,
        "phoneNum":atUserId,
        "openId":getApp().user.openid,
        "thumbnail": getApp().user.userInfo.avatarUrl,
        "nickName": getApp().user.userInfo.nickName,
    }
    getApp().user.token = config.initToken;
    requestUtil.request(serviceCode.BIND_WX_OPENID, business, function(isSuccess, result, returnCode, returnMsg){
        if(setViewCallback != null){
            setViewCallback(isSuccess, returnMsg);
        }
    });
}