/**
 * 小程序配置文件
 */

var host = "www.accecard.com"

var config = {
    // 登录地址，用于建立会话
    userServiceUrl: `https://${host}/api/auth`,
    accountUrl: `https://${host}/api/account`,
    smsUrl: `https://${host}/sms/message`,
    iouUrl: `https://${host}/api/eloan`,
    friendUrl: `https://${host}/api/fdship`,
    benefitUrl: `https://${host}/api/benefit`,
    messageUrl: "https://qmessage.accecard.com/api/message",
    
    smsKey: "1502660888820170109172206935",

    initToken: "411e7bc272a421b44802a9f608a740e5ca74872a",

    appId: "wxa65b5849a982acee",
    appSecret: "cfb281c890714533179135802c0e82bb",
};


var serviceCode = {
    BIND_PHONE_NUM: "5001U03",
    GET_TOKEN: "5002U01",
    GET_TOKEN_BY_OPENID: "1001W02",
    GET_USER: "5003U01",
    MODIFY_USER_INFO: "5003U02",
    REGISTER_USER: "5001U02",
    BIND_WX_OPENID: "5001U03",
    GET_SMS: "100101",
    VERIFY_SMS: "100102",

    CREATE_IOU: "100101",
    REQUEST_UNCONFIRMED_IOU_LIST: "100102",
    REQUEST_UNCONFIRMED_IOU_DETAIL: "100103",
    MESSAGE_LIST:"100101",
    CONFIRM_IOU:"200101",
    REJECT_IOU:"100104",
    REQUEST_VALID_IOU_LIST: "200102",
    REQUEST_VALID_IOU_DETAIL: "200103",

    QUERY_USER:"100201",
    ADD_FRIEND:"100202",
    REQUEST_FRD_LIST: "100203",
    REQUEST_BENEFIT_LIST: "100204",
    ADD_BENEFIT: "100205",
    DELETE_BENEFIT: "100206",
    SET_DEFAULT_BENEFIT:"100207",
    SET_PAY_PWD:"100108",
    MODIFY_ACCOUNT_PWD:"100109",
    VERIFY_SMS_CODE:"100110",
    SET_NEW_PAY_PWD:"100111",
}

module.exports = {
  config: config,
  serviceCode:serviceCode,
}