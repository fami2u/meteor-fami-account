Template.login.onCreated(function() {
    this.subscribe("users");
});
Template.login.helpers({
    facc: function() {
        return facc;
    },
    accountType: function(t) {
        return facc.accountType == t;
    },
});
Template.login.events({
    "click .page-login-forget": function() {
        $("#page-forget").removeClass("fadeOutDown").addClass("fadeInUp").show();
        $(".forgetBtn").show();
        $(".forgetLoginBtn").hide();
    },
    "click .page-login-register": function() {
        $("#page-reg").removeClass("fadeOutDown").addClass("fadeInUp").show();
    },
    "click .login-page-back": function() {
        $("#page-forget").removeClass("fadeInUp").addClass("fadeOutDown");
        $("#page-reg").removeClass("fadeInUp").addClass("fadeOutDown");
        $("#page-code").removeClass("fadeInUp").addClass("fadeOutDown");
    },
    "click .lh-back": function() {
        facc.callback();
    },
    'click .regBtn': function() {

        var account = $("#account").val();
        var nickname = facc.nickname ? $("#nickname").val() : ("用户" + parseInt(Math.random() * 1000000));
        var password = $("#password").val();

        if (password.length < 6) {
            alert('密码应大于六位');
            return false;
        }

        var type = facc.check(account);

        if (type != false) {
            if (type == "email") {
                $("#page-login-loading").show();
                Meteor.call('famiRegWithEmail', {
                    "host": window.location.host,
                    "email": account,
                    "password": password,
                    "nickname": nickname
                }, function(error, result) {
                    if (typeof result == "object") {
                        facc.set(result);

                        alert(nickname + '：欢迎，注册已成功～');
                        facc.callback();
                    } else if (result == "ERROR_REPEAT_EMAIL") {
                        alert('邮件地址已存在');
                    } else if (result == "ERROR_REPEAT_NICK") {
                        alert('昵称已存在');
                    } else {
                        alert('注册信息错误');
                    }
                    $("#page-login-loading").hide();
                });
            } else if (type == "tel") {

                $("#page-login-loading").show();

                Meteor.call('famiRegWithTel', {
                    "tel": account,
                    "password": password,
                    "nickname": nickname
                }, function(error, result) {
                    if (result == "SUCCESS") {
                        $("#page-code").removeClass("fadeOutDown").addClass("fadeInUp").show();
                    } else if (result == "ERROR_REPEAT_TEL") {
                        alert('手机号码已存在');
                    } else if (result == "ERROR_REPEAT_NICK") {
                        alert('昵称已存在');
                    } else {
                        alert('注册信息错误');
                    }
                    $("#page-login-loading").hide();
                });
            }

        }
    },
    "click .regBtnWithCode": function() {
        var account = $("#account").val();
        var nickname = facc.nickname ? $("#nickname").val() : ("用户" + parseInt(Math.random() * 1000000));
        var password = $("#password").val();
        var code = $("#lcode").val();

        if (code.length < 6) {
            alert('请填写六位验证码');
            return false;
        }

        var type = facc.check(account);

        if (type == "tel") {
            $("#page-login-loading").show();

            Meteor.call('famiRegWithTelAndCode', {
                "tel": account,
                "password": password,
                "nickname": nickname,
                "code": code
            }, function(error, result) {

                if (typeof result == "object") {
                    facc.set(result);
                    alert(nickname + '：欢迎，注册已成功～');
                    facc.callback();
                } else if (result == "ERROR_REPEAT_TEL") {
                    alert('手机号码已存在');
                } else if (result == "ERROR_REPEAT_NICK") {
                    alert('昵称已存在');
                } else {
                    alert('注册信息错误');
                }
                $("#page-login-loading").hide();

            });

        }
    },
    'click .loginBtn': function() {

        var account = $("#laccount").val();
        var password = $("#lpassword").val();

        if (password.length < 6) {
            alert('密码应大于六位');
            return false;
        }

        var type = facc.check(account);

        if (type != false) {
            if (type == "email") {
                $("#page-login-loading").show();
                Meteor.call('famiLoginWithEmail', {
                    "email": account,
                    "password": password
                }, function(error, result) {
                    if (typeof result == "object") {
                        facc.set(result);
                        alert(result.nickname + ',欢迎回来');
                        facc.callback();
                    } else {
                        alert('用户名/密码不匹配');
                    }
                    $("#page-login-loading").hide();
                });
            } else if (type == "tel") {
                $("#page-login-loading").show();
                Meteor.call('famiLoginWithTel', {
                    "tel": account,
                    "password": password
                }, function(error, result) {
                    if (typeof result == "object") {
                        facc.set(result);
                        alert(result.nickname + ',欢迎回来');
                        facc.callback();
                    } else {
                        alert('用户名/密码不匹配');
                    }
                    $("#page-login-loading").hide();
                });
            }
        }
    },
    "click .forgetBtn": function() {
        var account = $("#faccount").val();
        var type = facc.check(account);
        if (type != false) {
            if (type == "email") {
                $("#page-login-loading").show();
                Meteor.call('famiForgotWithEmail', {
                    "email": account
                }, function(error, result) {
                    if (result.indexOf("ERROR") < 0) {
                        $(".forgetBtn").hide();
                        $(".forgetLoginBtn").show();
                        alert('验证码已发送请注意查收');
                    } else {
                        alert('未找到用户');
                    }
                    $("#page-login-loading").hide();
                });
            } else if (type == "tel") {
                $("#page-login-loading").show();
                Meteor.call('famiForgotWithTel', {
                    "tel": account
                }, function(error, result) {
                    if (result.indexOf("ERROR") < 0) {
                        $(".forgetBtn").hide();
                        $(".forgetLoginBtn").show();
                        alert('验证码已发送请注意查收');
                    } else {
                        alert('未找到用户');
                    }
                    $("#page-login-loading").hide();
                });
            }

        }
    },
    "click .forgetLoginBtn": function() {
        var account = $("#faccount").val();
        var code = $("#fcode").val();

        var type = facc.check(account);

        if (type != false) {
            if (type == "email") {
                $("#page-login-loading").show();
                Meteor.call('famiLoginWithEmailTemp', {
                    "email": account,
                    "code": code
                }, function(error, result) {
                    if (typeof result == "object") {
                        facc.set(result);
                        alert(result.nickname + ',欢迎回来,请尽快修改密码');
                        facc.callback();
                    } else {
                        alert('信息错误');
                    }
                    $("#page-login-loading").hide();
                });
            } else if (type == "tel") {
                $("#page-login-loading").show();
                Meteor.call('famiLoginWithTelTemp', {
                    "tel": account,
                    "code": code
                }, function(error, result) {
                    if (typeof result == "object") {
                        facc.set(result);
                        alert(result.nickname + ',欢迎回来,请尽快修改密码');
                        facc.callback();
                    } else {
                        alert('信息错误');
                    }
                    $("#page-login-loading").hide();
                });
            }

        }

    }
});
