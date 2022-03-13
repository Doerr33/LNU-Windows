// pages/login/login.js
var that;
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },
  bindGetUserInfo(e) {
    //this：这个页面整个对象
    wx.getUserProfile({
      desc: '用于发布、聊天时显示头像昵称', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        // 获取登录信息成功
        if (res.userInfo) {
          // 授权登录时调取添加用户函数
          that.addUser(res.userInfo);
          console.log(res.userInfo);
        } else {
          // 获取登录信息失败
          wx.showToast({
            icon: 'none',
            title: '拒绝授权无法体验更多功能',
          })
        }
      }
    })

  },
  //添加用户信息到云数据库
  addUser(userInfo) {
    wx.showLoading({
      title: '正在登录...',
    })
    // 调用登录函数
    wx.cloud.callFunction({
      name: 'login',
      data: userInfo
    }).then(res => {
      console.log('callFunction success:', res)
      // 用户存在
      if (res.result.code == 200) {
        console.log("用户存在", res);
        getApp().globalData.userInfo = res.result.userInfo;
        wx.setStorage({
          data: JSON.stringify(res.result.userInfo),
          key: 'userInfo',
          success(res) {
            // 将用户信息存储到全局变量
            console.log("total储存信息到本地", res);
          }
        })
        // 将用户_openid存入页面
        userInfo.openid = res.result.userInfo._openid;
        console.log(res.result.userInfo._openid);
        that.setData({
          userInfo: res.result.userInfo[0]
        })
        wx.hideLoading()
        wx.showToast({
          icon: 'success',
          title: '登录成功',
        })
        wx.navigateBack({
          delta: 1,
        })
      }
      if (res.result.code == 201) {
        console.log("用户信息", userInfo);
        getApp().globalData.userInfo = userInfo;
        wx.setStorage({
          data: JSON.stringify(userInfo),
          key: 'userInfo',
          success(res) {
            // 将用户信息存储到全局变量
            console.log("存储用户信息", res);
            wx.hideLoading()
            wx.showToast({
              icon: 'success',
              title: '登录成功',
            })
            wx.navigateBack({
              delta: 1,
            })
          }
        })
        // 用户不存在
        console.log("用户不存在", res);
        // 用户注册，并返回_openid
        userInfo.openid = res.result._openid;
        console.log(res.result._openid);
      }
      // 将用户信息存储到本地


    }).catch(error => {
      wx.hideLoading()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    console.log("login onload:", getApp().globalData.userInfo)

    // 页面加载时判断用户是否授权登录
    if (getApp().globalData.userInfo) {
      wx.navigateBack({
        delta: 1,
      })
      that.setData({
        userInfo: getApp().globalData.userInfo
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

  }
})