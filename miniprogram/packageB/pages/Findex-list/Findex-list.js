// packageB/pages/Findex-list/Findex-list.js
var that;
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    // that.getCitys()
    that.getAddressBook()
  },
  getAddressBook(e) {
    db.collection('address_book')
      .where({
        _openid: getApp().globalData.userInfo._openid
      })
      .get()
      .then(res => {
        console.log("获取通讯录成功", res);
        if (res.data.length > 0) {
          var friendList = res.data;
          // 按拼音排序
          friendList.sort((c1, c2) => {
            let pinyin1 = c1.pinyin.join('')
            let pinyin2 = c2.pinyin.join('')
            return pinyin1.localeCompare(pinyin2)
          })
          // 添加首字母
          const map = new Map()
          for (const friend of friendList) {
            const alpha = friend.pinyin[0].charAt(0).toUpperCase()
            if (!map.has(alpha)) map.set(alpha, [])
            map.get(alpha).push({
              name: friend.nickName,
              avatarUrl:friend.avatarUrl,
              openid:friend.friend_id
            })
          }

          const keys = []
          for (const key of map.keys()) {
            keys.push(key)
          }
          keys.sort()

          const list = []
          for (const key of keys) {
            list.push({
              alpha: key,
              subItems: map.get(key)
            })
          }

          that.setData({
            list
          })
        }

      })
      .catch(err => {

      })
  },
  addFriend(e) {
    console.log(e);
    wx.navigateTo({
      url: '../search/search',
    })
  },
  onChoose(e) {
    console.log('onChoose', e)
    wx.navigateTo({
      url: '/pages/user/userInfo?openid=' 
      + e.detail.item.openid + '&nickName=' 
      + e.detail.item.name + '&avatarUrl=' +
       e.detail.item.avatarUrl,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})