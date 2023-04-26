let baseUrl = 'https://app.wildfirechat.net';
import wfc from './wfc/client/wfc'
import Config from './config'

wfc.init();
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
            // setItem('userId', userId);
            // setItem('token', token);
            // setItem("userPortrait", portrait);
        },
        error: function (xhr, status, error) {
            alert("登录失败：" + error);
        }
    });
});