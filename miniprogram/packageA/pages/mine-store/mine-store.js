// pages/mine-camera/mine-camera.js
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeList:[],
  },
  navToMiNi(e){
    console.log(e);
    var index = e.currentTarget.dataset.id;
    var APPID = that.data.storeList[index].APPID;
    wx.navigateToMiniProgram({
      appId: APPID,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  viewImages(e) {
    // console.log("朋友圈条目",index);
    var current = e.target.dataset.src;
    var index = e.target.dataset.index
    console.log(e);
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.cameraList[index].images // 需要预览的图片http链接列表  
    })
  },
  addLocation(e){
    if (!getApp().globalData.userInfo) {
      wx.navigateTo({
        url: '../login/login',
      })
    }
    else{
      wx.navigateTo({
        url: '/packageB/pages/publishStore/publishStore',
      })
    }
  },
   // 外卖下拉刷新
   getPullStore() {
    // 下拉刷新
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.cloud.callFunction({
      name:'getMiniStore'
    })
    .then(res => {
      console.log("获取商店列表成功", res);
      that.setData({
        storeList: res.result.data
      })
    })
    .catch(err => {
      console.error("获取相册失败", err);
    })
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '获取商店列表中',
    })
    that = this;
    wx.cloud.callFunction({
      name:'getMiniStore'
    })
    .then(res => {
      console.log("获取商店成功", res);
      that.setData({
        storeList: res.result.data
      })
      wx.hideLoading()
      wx.showToast({
        title: '获取成功',
      })
    })
    .catch(err => {
      console.error("获取商店失败", err);
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
    that.getPullStore();
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
    return {
      path: 'packageA/pages/mine-store/mine-store',//用户点开后的默认页面，我默认为首页
      imageUrl:"/images/stroe_publish.jpg",//自定义图片的地址
      title:'辽大商城'
    }
  },
  onShareTimeline:function(res){
    return{
      path: 'packageA/pages/mine-store/mine-store',//用户点开后的默认页面，我默认为首页
      imageUrl:"/images/stroe_publish.jpg",//自定义图片的地址
      title: '辽大商城',
      query: '辽大商城'
    }
  },
})