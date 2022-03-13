// pages/mypublishTea/mypublishTea.js
const app = getApp();
var that;
var db = wx.cloud.database()
var _ = db.command
let totalTeacher = -1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
     // 接收老师数据
     teacherList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      userInfo: getApp().globalData.userInfo,
    })
     // 获取家教总条数
     this.getTotalTeacher()

     // 获取家教数据
     this.getDataTeacher()
  },
  delTeacher(e){
    console.log("删除教师",e);
    var index = e.currentTarget.dataset.index;
    var id = that.data.teacherList[index]._id;
   
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (res) {
       if (res.confirm) {
        console.log('点击确定了');
        db.collection('teacher').doc(id).remove({
          success(res) {
            console.log("删除成功", res);
          },
          fail(res) {
            console.log("删除失败", res);
          }
         })
       } else if (res.cancel) {
         console.log('点击取消了');
         return false;    
        }
       that.setData({
          teacherList:that.data.teacherList
       });
      }
     })
  },
  CopyWeChatT(e){
    console.log("点击复制微信",e);
    var index = e.currentTarget.dataset.index;
    wx.setClipboardData({
      data: that.data.teacherList[index].weChat,
      success (res) {
        wx.getClipboardData({
          success (res) {
            console.log(res.data) // data
            wx.showToast({
              title: '复制成功',
            })
          }
        })
      }
    })
  },
  CopyPhoneT(e){
    console.log("点击复制电话",e);
    var index = e.currentTarget.dataset.index;
    wx.makePhoneCall({
      phoneNumber: that.data.teacherList[index].phone,
    })
  },
   // 获取家教数据
   getDataTeacher() {
    // 计算新闻长度len==totalNews时到底了
    let len = this.data.teacherList.length
    if (totalTeacher == len) {
      wx.showToast({
        title: '到底啦~',
      })
      // 直接退出不再执行下面代码
      return
    }
    // 按时间降序获取数据库数据
    wx.cloud.database().collection("teacher").orderBy('time', 'desc')
      .where({
        _openid : that.data.userInfo._openid
      })
      // 每次20条，0，20，40，60
      .skip(len)
      .get()
      .then(res => {
        console.log("获取成功", res);
        // 拼接新闻，0+20，20+20，40+20
        this.setData({
          teacherList: this.data.teacherList.concat(res.data)
        })
      })
      .catch(res => {
        console.log("获取失败", res);
      })
  },
  // 计算家教总条数
  getTotalTeacher() {
    // 计算新闻总条数，加载页面时
    wx.cloud.database().collection('teacher').count()
      .then(res => {
        // console.log("数据总条数", res)
        totalTeacher = res.total
      })
  },
   // 家教下拉刷新
   getPullTeacher() {
    // 下拉刷新
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.cloud.database().collection("teacher").orderBy('time', 'desc')
      .where({
        _openid : that.data.userInfo._openid
      })
      .get()
      .then(res => {
        console.log("获取成功", res);
        this.setData({
          teacherList: res.data
        })
      })
      .catch(res => {
        console.log("获取失败", res);
      })
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);
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
    this.getPullTeacher()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getDataTeacher()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})