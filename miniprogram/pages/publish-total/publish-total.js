// pages/publish-total/publish-total.js
const app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ColorList: app.globalData.ColorList,
    userInfo:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    that = this;
    that.setData({
      userInfo: getApp().globalData.userInfo,
    })
    
    if(!that.data.userInfo){
      wx.navigateTo({
        url: '../login/login',
      })
    }else{
        wx.cloud.callFunction({
          name: 'login',
          data: that.data.userInfo
        }).then(res => {
          console.log('callFunction success:', res)
          // 用户存在
          if(res.result.code==200){
            console.log("用户存在",res);
            getApp().globalData.userInfo = res.result.userInfo;
            wx.setStorage({
              data: JSON.stringify(res.result.userInfo),
              key: 'userInfo',
              success(res) {
                // 将用户信息存储到全局变量
                console.log("total储存信息到本地",res);
              }
            })
            // 将用户_openid存入页面
            userInfo.openid=res.result.userInfo._openid;
            console.log("查询到的信息",res.result.userInfo);
            that.setData({
              userInfo:res.result.userInfo[0]
            })
          }
          if(res.result.code==201){
            wx.navigateTo({
              url: '../login/login',
            })
          }
        }).catch(error => {
        })
    
    }
    
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