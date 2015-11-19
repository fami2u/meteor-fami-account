Hi ! family of developer :)
=====================================
欢迎关注
[FAMI](http://www.fami2u.com)
------------------------------
#### 依赖关系
#####需要在 Meteor add 以下package
[kadira:flow-router](https://atmospherejs.com/kadira/flow-router)

[meteorhacks:flow-layout](https://atmospherejs.com／meteorhacks／flow-layout)

[materialize:materialize](https://atmospherejs.com/materialize／materialize)

##### package 中依赖的其它 packages
[templating](https://atmospherejs.com/templating) ［client］

[natestrauser:animate-css](https://atmospherejs.com/natestrauser／animate-css) ［client］

[fortawesome:fontawesome](https://atmospherejs.com/fortawesome／fontawesome) ［client］

[email](https://atmospherejs.com/email) ［server］

[http](https://atmospherejs.com/http)［server］

[jparker:crypto-md5](https://atmospherejs.com/jparker/crypto-md5)［server］


####SERVER端的配置

```
//sever/server.js

Meteor.startup(function (){
	
	facc.sms.server = "短信服务请求地址"; 
	facc.sms.account = "短信服务用户名"; 
	facc.sms.pwd = "短信服务密码";
	facc.email.url = "smtp链接串";
    /*
    类似于
    "smtp://kf%40fami2u.com:pwd@smtp.exmail.qq.com:465"
    其中邮箱用户名中的"@"替换为"%40"
    */
	facc.email.from = "FAMI客服 <kf@fami2u.com>";//发送邮件地址
    /*
  	可以直接填写邮件地址："kf@fami2u.com"
    或者按上边的方式设置发送者名称
    */
    
	facc.init();
    /*
    	init中执行相关初始化操作包括设置MAIL_URL
    */
});
```
#### CLIENT端的配置

```
//client/client.js

Meteor.startup(function (){
	／＊
    	客户端的登录方式	
    	1:email
        2:mobile
        3:email 或者 mobile
    ＊／
	facc.sms.accountType ＝ 1；
    
    //注册时是否需要输入昵称，false会自动分配昵称
    facc.sms.nickname ＝ true；
    
    //为登录页头部设置样式
    facc.headerStyle ＝ "background-color:#fff;color:#333"；
    //未登录页主体设置样式
    facc.bodyStyle ＝ "background-color:#f1f1f1;"；
	
});
```
####一些会用到的方法
```
[CLIENT]facc.user() 
获取当前用户信息
```

```
[CLIENT]facc.attr(key,[value])
获取/设置用户的属性
```
```
[CLIENT]facc.set(user)
设置用户
```
```
[CLIENT]facc.isGuest()
判断是否为访客
```
```
[CLIENT]facc.login()
登录方法
```
```
[CLIENT]facc.logout()
登出方法
```

- - -

####使用的一些方式
使用了 flow-router作为路由，一般情况下可以设置全局的enter作为过滤器控制访问权限。
```
FlowRouter.triggers.enter([function(context,redirect){
	if(facc.isGuest()){
		facc.login();
	}
}], {except: ["login"]});
```
同时设置两个route 来访问
```
FlowRouter.route('/login', {
  name:"login",
  action: function(params, queryParams) {
    FlowLayout.render("login");
  }
});
FlowRouter.route('/logout', {
  action: function(params, queryParams) {
    facc.logout();
    FlowRouter.go("/");
  }
});
```

####关于后边将会如何改进
1. 增加服务端的支持/或增加对account-base的支持
1. 更多的可自定义样式
1. 更方便的配置短信与邮箱配置
1. 整理代码更清晰一些
1. 继承一些第三方登录功能
```
/*
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
    */
```
1. 增加积分或账户余额管理
1. 增加可选的邀请码注册
1. 增加注册渠道统计
- - -

#### zuihou >
刚刚开始接触Meteor，这种快速开发的方式很适合早起项目的快速迭代。希望能与在此方向上比较有经验的开发者～一起交流学习~[FAMI开发者之家](mail://sunhannan@fami2u.com)
