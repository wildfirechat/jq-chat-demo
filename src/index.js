import EventType from "./wfc/client/wfcEvent";

let baseUrl = 'https://app.wildfirechat.net';
import wfc from './wfc/client/wfc'
import Config from './config'
import TextMessageContent from "./wfc/messages/textMessageContent";
import Conversation from "./wfc/model/conversation";
import ConversationType from "./wfc/model/conversationType";
import {stringValue} from "./wfc/util/longUtil";

wfc.init();
wfc.eventEmitter.on(EventType.ReceiveMessage, (msg, hasMore) => {
    $("#console").text("收到消息" + JSON.stringify(msg));
})

$("#send-code-button").click(function (event) {
    event.preventDefault();
    var phone = $("#phone").val();

    console.log('phone', phone);
    // 发送 AJAX 请求到服务器以获取验证码
    $.ajax({
        url: baseUrl + "/send_code",
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            mobile: phone
        }),
        success: function (response) {
            console.log('send_code response', response);
            alert("验证码已发送至您的手机！");
        },
        error: function (xhr, status, error) {
            alert("出错了：" + error);
        }
    });
});

// 登录表单提交事件
$("#login-form").submit(function (event) {
    event.preventDefault();
    var phone = $("#phone").val();
    var code = $("#code").val();

    // 发送 AJAX 请求到服务器以验证用户输入的手机号码和验证码
    $.ajax({
        url: baseUrl + "/login",
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            mobile: phone,
            code: code,
            platform: Config.SDK_PLATFORM_WEB,
            clientId: wfc.getClientId(),
        }),
        success: function (response) {
            console.log('login response', response);
            //window.location.href = "/home";
            const {userId, token, portrait} = response.result;
            wfc.connect(userId, token);
            $('#login-form').hide()
            $('#action-container').show();
            // setItem('userId', userId);
            // setItem('token', token);
            // setItem("userPortrait", portrait);
        },
        error: function (xhr, status, error) {
            alert("登录失败：" + error);
        }
    });
});

$("#get-user-info-button").click(function () {
    let userInfo = wfc.getUserInfo(wfc.getUserId());
    console.log('getUserInfo', userInfo)
    $("#console").text("用户信息" + JSON.stringify(userInfo));
});
$("#send-msg-button").click(function () {
    let textMessageContent = new TextMessageContent('hello world');
    let conversation = new Conversation(ConversationType.Single, "FireRobot", 0);
    wfc.sendConversationMessage(conversation, textMessageContent, [], null, null, (messageUid) => {
        $("#console").text("消息发送成功" + stringValue(messageUid));
    }, (err) => {

    })
});
$("#get-conversation-list-button").click(function () {
    let conversationList = wfc.getConversationList([0, 1, 2], [0, 1])
    $("#console").text("会话列表" +  JSON.stringify(conversationList));
});