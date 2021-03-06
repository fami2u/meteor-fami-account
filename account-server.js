facc.insert = function(err,id){console.log("create a account")};
Meteor.methods({
    famiRegWithEmail: function(args) {
        // this.unblock();
        if ((args.email == "") || !facc.checkEmail(args.email)) {
            return "ERROR_UNKONE";
        }

        var user = Meteor.users.findOne({
            email: args.email
        });

        if (user) {
            return "ERROR_REPEAT_EMAIL";
        }

        user = Meteor.users.findOne({
            nickname: args.nickname
        });

        if (user) {
            return "ERROR_REPEAT_NICK";
        }
        salt = parseInt(Math.random() * 1000000) + "";
        salt = CryptoJS.MD5(salt).toString();
        var md5 = CryptoJS.MD5(args.password + salt).toString();
        user = {
            "nickname": args.nickname,
            "username": args.nickname,
            "password": md5,
            "salt": salt,
            "email": args.email,
            "vaildEmail": false,
            "tel": "",
            "avatar": "/avatar.png",
            "point": 0,
            "balance": 0,
            "isadmin":0,
            "createAt":new Date(),
        };
        var uid = Meteor.users.insert(user,facc.insert);
        
        if (facc.email.enable) {
            var code = parseInt(Math.random() * 10000000);
            var path = "http://" + args.host + "/verfEmail?code=" + code;
            var html = facc.email.html.replace("{nick}", args.nickname).replace("{link}", path).replace("{code}", code);
            Email.send({
                to: args.email,
                from: facc.email.from,
                subject: facc.email.subject,
                html: html,
            });
        }

        if(facc.needAdmin == 1){
            return "ERROR_RIGHT";
        }

        this.setUserId(uid);

        return {
            "_id": uid,
            "nickname": user.nickname,
            "avatar": user.avatar,
        };
        
    },
    famiRegWithTel: function(args) {
        if ((args.tel == "") || !facc.checkTel(args.tel)) {
            return "ERROR_UNKONE";
        }

        var user = Meteor.users.findOne({
            tel: args.tel
        });

        if (user) {
            return "ERROR_REPEAT_TEL";
        }

        user = Meteor.users.findOne({
            nickname: args.nickname
        });

        if (user) {
            return "ERROR_REPEAT_NICK";
        }

        this.unblock();

        var code = parseInt(Math.random() * 1000000);

        VaildCodes.insert({
            "account": args.tel,
            "code": code + ""
        });

        var html = args.nickname + ",您好:\n您的验证码是：" + code + ".请尽快登录，勿将此信息透露给他人。";

        console.log("SMS:" + html);

        HTTP.call("POST", facc.sms.server, {
                data: {
                    account: facc.sms.account,
                    pswd: facc.sms.pwd,
                    mobile: args.tel,
                    msg: html,
                }
            },
            function(error, result) {
                console.log(result);
                if (!error) {
                    console.log("SMS-RES:" + result.content);
                } else {
                    console.log("SMS-ERR:" + error);
                }
            });
        return "SUCCESS";
    },
    famiLoginWithEmail: function(args) {
        // this.unblock();
        if ((args.email == "") || !facc.checkEmail(args.email)) {
            return "ERROR_UNKONE";
        }

        var user = Meteor.users.findOne({
            email: args.email
        });

        if (!user) {
            return "ERROR_NONE";
        }

        if((facc.needAdmin == 1) && (user.isadmin != 1)){
            return "ERROR_RIGHT";
        }

        salt = user.salt;

        var md5 = CryptoJS.MD5(args.password + salt).toString();

        if (md5 != user.password) {
            return "ERROR_PWD";
        }

        
        this.setUserId(user._id);

        return {
            "_id": user._id,
            "nickname": user.nickname,
            "avatar": user.avatar,
        };
    },
    famiLoginWithTel: function(args) {
        console.log(args);
        // this.unblock();
        if ((args.tel == "") || !facc.checkTel(args.tel)) {
            return "ERROR_UNKONE";
        }

        var user = Meteor.users.findOne({
            tel: args.tel
        });

        if (!user) {
            return "ERROR_NONE";
        }

        if((facc.needAdmin == 1) && (user.isadmin != 1)){
            return "ERROR_RIGHT";
        }

        salt = user.salt;

        var md5 = CryptoJS.MD5(args.password + salt).toString();

        if (md5 != user.password) {
            return "ERROR_PWD";
        }

        this.setUserId(user._id);

        return {
            "_id": user._id,
            "nickname": user.nickname,
            "avatar": user.avatar,
        };
    },
    famiForgotWithEmail: function(args) {
        if ((args.email == "") || !facc.checkEmail(args.email)) {
            return "ERROR_UNKONE";
        }

        var user = Meteor.users.findOne({
            email: args.email
        });

        if (!user) {
            return "ERROR_NONE";
        }

        this.unblock();

        var code = parseInt(Math.random() * 1000000);

        VaildCodes.insert({
            "account": args.email,
            "code": code + ""
        });

        var html = user.nickname + ",您好:<br/>临时验证码是：" + code + ".请尽快登录修改密码，勿将此信息透露给他人。";
        Email.send({
            to: args.email,
            from: facc.email.from,
            subject: facc.email.subject,
            html: html,
        });
        return "SUCCESS";
    },

    famiLoginWithEmailTemp: function(args) {
        if ((args.email == "") || !facc.checkEmail(args.email)) {
            return "ERROR_UNKONE";
        }
        var vc = VaildCodes.findOne({
            "account": args.email,
            "code": args.code + ""
        });
        if (!vc) {
            return "ERROR_NONE";
        }

        VaildCodes.remove(vc._id);

        var user = Meteor.users.findOne({
            email: args.email
        });

         if((facc.needAdmin == 1) && (user.isadmin != 1)){
            return "ERROR_RIGHT";
        }
        this.setUserId(user._id);
        return {
            "_id": user._id,
            "nickname": user.nickname,
            "avatar": user.avatar,
        };
    },
    famiRegWithTelAndCode: function(args) {
        if ((args.tel == "") || !facc.checkTel(args.tel)) {
            return "ERROR_UNKONE";
        }
        var vc = VaildCodes.findOne({
            "account": args.tel,
            "code": args.code + ""
        });
        if (!vc) {
            return "ERROR_NONE";
        }

        VaildCodes.remove(vc._id);


        var user = Meteor.users.findOne({
            tel: args.tel
        });

        if (user) {
            return "ERROR_REPEAT_TEL";
        }

        user = Meteor.users.findOne({
            nickname: args.nickname
        });

        if (user) {
            return "ERROR_REPEAT_NICK";
        }
        salt = parseInt(Math.random() * 1000000) + "";
        salt = CryptoJS.MD5(salt).toString();
        var md5 = CryptoJS.MD5(args.password + salt).toString();
        user = {
            "nickname": args.nickname,
            "username": args.nickname,
            "password": md5,
            "salt": salt,
            "email": "",
            "vaildEmail": false,
            "tel": args.tel,
            "avatar": "/avatar.png",
            "point": 0,
            "balance": 0,
            "isadmin":0,
            "createAt":new Date(),
        };
       
        var uid = Meteor.users.insert(user,facc.insert);
        if(facc.needAdmin == 1){
            return "ERROR_RIGHT";
        }
        this.setUserId(uid);

        return {
            "_id": uid,
            "nickname": user.nickname,
            "avatar": user.avatar,
        };
    },
    famiForgotWithTel: function(args) {
        if ((args.tel == "") || !facc.checkTel(args.tel)) {
            return "ERROR_UNKONE";
        }

        var user = Meteor.users.findOne({
            tel: args.tel
        });


        if (!user) {
            return "ERROR_NONE";
        }

        this.unblock();

        var code = parseInt(Math.random() * 1000000);

        VaildCodes.insert({
            "account": args.tel,
            "code": code + ""
        });

        var html = user.nickname + ",您好:\n您的验证码是：" + code + ".请尽快登录,修改密码～勿将此信息透露给他人。";

        console.log("SMS:" + html);

        HTTP.call("POST", facc.sms.server, {
                data: {
                    account: facc.sms.account,
                    pswd: facc.sms.pwd,
                    mobile: args.tel,
                    msg: html,
                }
            },
            function(error, result) {
                console.log(result);
                if (!error) {
                    console.log("SMS-RES:" + result.content);
                } else {
                    console.log("SMS-ERR:" + error);
                }
            });
        return "SUCCESS";
    },
    famiLoginWithTelTemp: function(args) {
        if ((args.tel == "") || !facc.checkTel(args.tel)) {
            return "ERROR_UNKONE";
        }
        var vc = VaildCodes.findOne({
            "account": args.tel,
            "code": args.code + ""
        });
        if (!vc) {
            return "ERROR_NONE";
        }

        VaildCodes.remove(vc._id);

        var user = Meteor.users.findOne({
            tel: args.tel
        });

        if((facc.needAdmin == 1) && (user.isadmin != 1)){
            return "ERROR_RIGHT";
        }
        this.setUserId(user._id);

        return {
            "_id": user._id,
            "nickname": user.nickname,
            "avatar": user.avatar,
        };
    },

});
