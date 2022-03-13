const db = wx.cloud.database();
// 导入中文转拼音插件
import pinyin from 'wl-pinyin'
Page({
  data: {
    inputShowed: false,
    inputVal: ""
  },
  onLoad() {
    this.setData({
      search: this.search.bind(this)
    })
  },
  search: function (value) {
    if (value.trim().length == 0) {
      return;
    }
    return wx.cloud.callFunction({
      name: 'searchUser',
      data: {
        key: value
      }
    }).then(res => {
      console.log("搜索成功", res);
      var result = [];
      if (res.result.data.length > 0) {
        for (var i = 0; i < res.result.data.length; i++) {
          var item = {};
          item.text = res.result.data[i].nickName;
          item.value = i + 1;
          item.user = res.result.data[i];
          item.user.pinyin = pinyin.getPinyin(item.text).split(' ')
          console.log(pinyin.getPinyin(item.text));
          result.push(item)
        }
      }
      return result;
    }).catch(err => {
      console.error("搜索失败", err);
    })
  },
  // 添加好友到通讯录
  selectResult: function (e) {
    console.log('select result', e.detail)
    db.collection('address_book').where({
        _openid: getApp().globalData.userInfo._openid,
        firend_id: e.detail.item.user._openid
      }).count()
      .then(res => {
        console.log("查询成功", res);
        if (res.total > 0) {
          wx.showToast({
            icon: 'none',
            title: '当前用户已经在通讯录',
          })
        } else {
          db.collection('address_book').add({
            data: {
              friend_id: e.detail.item.user._openid,
              nickName: e.detail.item.user.nickName,
              avatarUrl: e.detail.item.user.avatarUrl,
              pinyin:e.detail.item.user.pinyin,
              time: new Date()
            }
          }).then(res => {
            console.log("添加成功", res);
            wx.showToast({
              title: '添加用户到通讯录成功'
            })
          }).catch(err => {

          })
        }
      })
      .catch(err => {

      })
  },
});