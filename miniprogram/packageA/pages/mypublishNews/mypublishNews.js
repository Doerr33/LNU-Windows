// pages/mypublishNews/mypublishNews.js
const app = getApp();
var that;
var db = wx.cloud.database()
var _ = db.command
let totalNews = -1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 接收新闻页数据
    newsList: [],
    userInfo:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      userInfo: getApp().globalData.userInfo,
    })

     
  },
  // 新闻下拉刷新
  getPullNews() {
    // 下拉刷新
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.cloud.database().collection("news").orderBy('time', 'desc')
      .where({
        _openid : that.data.userInfo._openid
      })
      .get()
      .then(res => {
        console.log("获取成功", res);
        this.setData({
          newsList: res.data
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
  // 获取新闻数据
  getDataNews() {
    // 计算新闻长度len==totalNews时到底了
    let len = this.data.newsList.length
    if (totalNews == len) {
      wx.showToast({
        title: '到底啦~',
      })
      // 直接退出不再执行下面代码
      return
    }
    // console.log("新闻list长度", len);

    // 按时间降序获取数据库数据
    wx.cloud.database().collection("news").orderBy('time', 'desc').where({
      _openid : that.data.userInfo._openid
    })
      // 每次20条，0，20，40，60
      .skip(len)
      .get()
      .then(res => {
        console.log("获取成功", res);
        // 拼接新闻，0+20，20+20，40+20
        this.setData({
          newsList: this.data.newsList.concat(res.data)
        })
      })
      .catch(res => {
        console.log("获取失败", res);
      })
  },
  // 计算新闻总条数
  getTotalNews() {
    // 计算新闻总条数，加载页面时
    wx.cloud.database().collection('news').count()
      .then(res => {
        // console.log("数据总条数", res)
        totalNews = res.total
      })
  },
  delNews(e){
    var index = e.currentTarget.dataset.index;
    var id = that.data.newsList[index]._id;
    console.log("删除新闻",e);
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (res) {
       if (res.confirm) {
        console.log('点击确定了');
        db.collection('news').doc(id).remove({
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
          newsList:that.data.newsList
       });
      }
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
    // 调用计算新闻总条数
    this.getTotalNews()

    // 调用获取新闻函数
    this.getDataNews()
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
     // 调用下拉刷新
     this.getPullNews()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
     // 触底刷新事件
     this.getDataNews()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})