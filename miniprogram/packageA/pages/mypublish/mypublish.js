// pages/mypublish/mypublish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  showQrcode(e){
    wx.showToast({
      title: '通讯录不提供修改删除',
    })
  },
  showQrcode0(e){
    console.log(e);
    wx.navigateTo({
      url: '../mypublishNews/mypublishNews',
    })
  },
  showQrcode1(e){
    console.log(e);
    wx.navigateTo({
      url: '../mypublishLove/mypublishLove',
    })
  },
  showQrcode2(e){
    console.log(e);
    wx.navigateTo({
      url: '../mypublishTea/mypublishTea',
    })
  },
  showQrcode3(e){
    console.log(e);
    wx.navigateTo({
      url: '../mypublishTeaX/mypublishTeX',
    })
  },
  showQrcode4(e){
    console.log(e);
    wx.navigateTo({
      url: '../mypublishCar/mypublishCar',
    })
  },
  showQrcode5(e){
    console.log(e);
    wx.navigateTo({
      url: '../mpublisHousex/mpublisHousex',
    })
  },
  showQrcode6(e){
    console.log(e);
    wx.navigateTo({
      url: '../mypublishTiaoZao/mypublishTiaoZao',
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