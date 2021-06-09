# wx-ngacn
ngacn 微信小程序版


```
1.目录下 npm install
2.微信开发者工具 -> 工具 -> 构建npm
```

login_code_pic: `http://183.134.74.185:2222/addReferer/login_check_code.php?id=_${self.data.randomCode}`
登陆验证码图片获取，需要特定referer，搭建了个ngnix修改小程序自带的referer，不然返回空

<image class="avatar" src="http://183.134.74.185:2222/clearReferer\?url\={{userInfo.avatar}}" />
头像照片，请求图片需要去除referer，不然403
