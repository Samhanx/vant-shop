module.exports = {
  signIn(req, res) {
    res.json({
      "code": 0,
      "message": "登录成功",
      "userInfo": {
        "id": 4,
        "telephone": "13922222922",
        "member_name": "李四",
        "sex": 1,
        "address": "",
        "avatar": "/attachment/memberAvatar/20180506/2018050612053000000015.png",
        "access_token": "DB3HBUwmXh2yj5iOy6PBMwbCrs8aaOwp"
      }
    })
  },

  signUp(req, res) {
    res.json({
      code: 0,
      message: '注册成功'
    })
  }
}