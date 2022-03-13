// pages/mypublishCar/mypublishCar.js
const app = getApp();
var that;
var db = wx.cloud.database();
let totalHouse = -1
var _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    // 接收房源数据
    house: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      userInfo: getApp().globalData.userInfo,
    })
    // 获取房源总条数
    this.getTotalHouse()
    // 获取房源数据
    this.getDataHouse()
  },
  // 获取房源数据
  getDataHouse() {
    // 计算新闻长度len==totalNews时到底了
    let len = this.data.house.length
    if (totalHouse == len) {
      wx.showToast({
        title: '到底啦~',
      })
      // 直接退出不再执行下面代码
      return
    }
    // console.log("新闻list长度", len);

    // 按时间降序获取数据库数据
    wx.cloud.database().collection("house").orderBy('time', 'desc')
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
          house: this.data.house.concat(res.data)
        })
      })
      .catch(res => {
        console.log("获取失败", res);
      })
  },
  // 计算租房需求总条数
  getTotalHouse() {
    // 计算新闻总条数，加载页面时
    wx.cloud.database().collection('house').count()
      .then(res => {
        // console.log("数据总条数", res)
        totalHouse = res.total
      })
  },
   // 房源需求刷新
   getPullHouse() {
    // 下拉刷新
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.cloud.database().collection("house").orderBy('time', 'desc')
      .where({
        _openid : that.data.userInfo._openid
      })
      .get()
      .then(res => {
        console.log("获取成功", res);
        this.setData({
          house: res.data
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
  CopyPhoneH(e){
    console.log("点击复制电话",e);
    var index = e.currentTarget.dataset.index;
    wx.makePhoneCall({
      phoneNumber: that.data.house[index].phone,
    })
  },
  delHourse(e){
    console.log("删除教师",e);
    var index = e.currentTarget.dataset.index;
    var id = that.data.house[index]._id;
   
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (res) {
       if (res.confirm) {
        console.log('点击确定了');
        db.collection('house').doc(id).remove({
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
        house:that.data.house
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
    this.getPullHouse()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getDataHouse()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})