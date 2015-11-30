facc = {
    _id: "FAMILYOFDEVELOPOER",
    user: function() {
        // console.log(facc._id);
        return {
            "_id": localStorage.getItem(facc._id + "_UID"),
            "nickname": localStorage.getItem(facc._id + "_NICK"),
            "avatar": localStorage.getItem(facc._id + "_AVATAR"),
        };
        // return Session.get(facc._id);
    },
    set: function(user) {
        Meteor.connection.setUserId(user._id);
        localStorage.setItem(facc._id + "_UID", user._id);
        localStorage.setItem(facc._id + "_NICK", user.nickname);
        localStorage.setItem(facc._id + "_AVATAR", user.avatar);
        // Session.set(facc._id, user);
    },
    logout: function() {
        localStorage.removeItem(facc._id + "_UID");
        localStorage.removeItem(facc._id + "_NICK");
        localStorage.removeItem(facc._id + "_AVATAR");
        Meteor.logout();
        // Session.set(facc._id, false);
    },
    isGuest: function() {
        return localStorage.getItem(facc._id + "_UID") ? false : true;
    },
    callback:function(){},
    login: function(callback) {
        Meteor.connection.logout();
        facc.callback = callback;
    },
    
    //1:email,2:mobile,3:email||mobile
    accountType: 1,
    nickname: true,
    thrid: {
        weibo: {
            enable: false,
            accessId: "",
            secretKey: ""
        },
        wechat: {
            enable: false,
            accessId: "",
            secretKey: ""
        },
        qq: {
            enable: false,
            accessId: "",
            secretKey: ""
        },
    },
    sms: {
        server: 'http://222.73.117.158/msg/HttpBatchSendSM?',
        account: "",
        pwd: "",
    },
    email: {
        enable: false,
        from: "",
        subject: "确认您的注册信息",
        html: "{nick}，您好：<br/>您的确认密码是：请尽快进行验证<a href='{link}'>{code}</a>",
        url: '',
    },
    init: function() {
        process.env.MAIL_URL = facc.email.url;

    },
    checkEmail: function(str) {
        return str.match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/);
    },
    checkTel: function(str) {
        return str.match(/^(((13[0-9]{1})|159|153)+\d{8})$/);
    },
    check: function(account) {
        var type = true;
        //验证是否为空
        if ((facc.accountType == 1)) {
            type = "email";
            if ((account == "") || !facc.checkEmail(account)) {
                Materialize.toast('请填写正确的电子邮件地址', 2000);
                return false;
            }
        }

        if ((facc.accountType == 2)) {
            type = "tel";
            if ((account == "") || !facc.checkTel(account)) {
                Materialize.toast('请填写正确的手机号码', 2000);
                return false;
            }
        }

        if ((facc.accountType == 3)) {
            if ((account == "")) {
                Materialize.toast('请填写正确的手机号码/电子邮件', 2000);
                return false;
            }
            if (facc.checkEmail(account)) {
                type = "email";
            }
            if (facc.checkTel(account)) {
                type = "tel";
            }
        }

        if (type == "") {
            Materialize.toast("请检查您的帐号格式", 2000);
            return false;
        }


        return type;
    },
    //colors
    headerStyle: "background-color:#fff;color:#333",
    bodyStyle: "background-color:#f1f1f1;",
};
