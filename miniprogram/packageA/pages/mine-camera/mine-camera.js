// pages/mine-camera/mine-camera.js
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cameraList:[],
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
    wx.navigateTo({
      url: '/packageB/pages/publish-camera/publish-camera',
    })
  },
   // 外卖下拉刷新
   getPullStore() {
    // 下拉刷新
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.cloud.callFunction({
      name:'getMineCamrea'
    })
    .then(res => {
      console.log("获取相册成功", res);
      that.setData({
        cameraList: res.result.data
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
      title: '获取相册图片中',
    })
    that = this;
    wx.cloud.callFunction({
      name:'getMineCamrea'
    })
    .then(res => {
      console.log("获取相册成功", res);
      that.setData({
        cameraList: res.result.data
      })
      wx.hideLoading()
      wx.showToast({
        title: '获取成功',
      })
    })
    .catch(err => {
      console.error("获取相册失败", err);
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
      path: 'packageA/pages/mine-camera/mine-camera',//用户点开后的默认页面，我默认为首页
      imageUrl:"/images/LNUC.jpg",//自定义图片的地址
      title:'辽大相册'
    }
  },
  onShareTimeline:function(res){
    return{
      path: 'packageA/pages/mine-camera/mine-camera',//用户点开后的默认页面，我默认为首页
      imageUrl:"/images/LNUC.jpg",//自定义图片的地址
      title: '辽大相册',
      query: '辽大相册'
    }
  },
})