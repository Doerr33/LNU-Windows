// pages/chatgroup/editName.js
var db = wx.cloud.database()
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupId: '',
    name: '',
    value: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    // 接收上个页面传递过来的参数
    that.setData({
      groupId: options.groupId,
      name: options.name
    })
    // name：可能没值
    if (that.data.name) {
      that.setData({
        value: that.data.name
      })
    }
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

  },
  onInput(e) {
    that.setData({
      value: e.detail.value
    })
  },

  onConfirm() {
    var name = that.data.value.trim();
    if (name.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '群名不能为空',
      })

      return
    }
    wx.showLoading({
      title: '正在编辑',
    })
    that.updateGroupName();
  },

  updateGroupName() {
    // 修改群名
    db.collection('chat_group')
      .where({
        _id: that.data.groupId
      })
      .update({
        data: {
          name: that.data.value.trim()
        }
      })
      .then(res => {
        if (res.stats.updated == 1) {
          // 发送系统聊天消息
          that.sendChatMsg();
        }
      })
  },

  sendChatMsg() {
    // 发送系统聊天消息
    var time = new Date();
    var timeTS = Date.now();
    const doc = {
      _id: `${Math.random()}_${timeTS}`,
      groupId: that.data.groupId,
      msgType: 'sys',
      textContent: '修改群名为“' + that.data.value.trim() + '”',
      sendTime: time,
      sendTimeTS: timeTS, // fallback
      creatorName: getApp().globalData.userInfo.nickName
    }
    db.collection('chat_msg').add({
        data: doc,
      })
      .then(res => {
        // 修改消息列表中的消息
        that.updateSysMsg('修改群名为“' + that.data.value.trim() + '”', time, timeTS);
      })
  },
  updateSysMsg(text, time, timeTS) {
    // 修改消息列表中消息
    db.collection('sys_msg')
      .where({
        type: 2,
        groupId: that.data.groupId,
      })
      .update({
        data: {
          title:that.data.value.trim(),
          content: text,
          time: time,
          sendTimeTS: timeTS,
          childType: 'chat_sys'
        }
      })
      .then(res=>{
        wx.hideLoading()
        wx.showToast({
          title: '编辑群名成功',
        })
        var pages = getCurrentPages();
        // 获取上个页面,并调用上个页面的方法setGroupName：设置groupInfo的值
        var prePage = pages[pages.length-2];
        prePage.setGroupName(that.data.value.trim(), timeTS);
        wx.navigateBack({
          delta: 1,
        })
      })
  },
})