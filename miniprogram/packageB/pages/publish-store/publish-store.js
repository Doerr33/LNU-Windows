// pages/publish/publish.js
var that;
const app = getApp();
const db = wx.cloud.database().collection("phone")
// 获取时间
var util = require('../../../utils/utils');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    // 外卖分类
    picker: ["三食堂", "四食堂", "桃李一楼", "桃李二楼", "桃李三楼", "崇山清真", "友园", "大食堂一楼", "大食堂二楼", "大食堂三楼", "蒲河清真"],
    // 分类id
    index: null,
    // 选择校区
    picker1: ['崇山校区', '蒲河校区'],
    // 标签索引
    index1: null,
    // 菜单图片临时链接
    imgList: [],
    // 菜单图片id获取fileID
    imageID: [],
    // 获取显示店名
    textareaAValue: '',
    // 获取微信
    textareaBValue: '',
    // 获取营业时间
    textareaCalue: '',
    // 表单内容
    formContent: [],
    // 时间
    time: ''
  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
    console.log("a", e.detail.value);
  },
  PickerChange1(e) {
    console.log(e);
    this.setData({
      index1: e.detail.value
    })
    console.log("a", e.detail.value);
  },
  
  // 获取店名内容
  textareaAInput(e) {
    setTimeout(() => {
      wx.cloud.callFunction({
        name: 'checkImg',
        data: {
          msg: e.detail.value,
        },
        success(res) {
          console.log(res.result)
          if (res.result.errCode == 87014) {
            wx.showToast({
              icon:'none',
              title: e.detail.value + "违规",
            })
            return
          }
          else{
            that.setData({
              textareaAValue:e.detail.value
            })
          }
        }
      })
    }, 50)
  },
  // 输入APPID
  textareaBInput(e) {
    setTimeout(() => {
      wx.cloud.callFunction({
        name: 'checkImg',
        data: {
          msg: e.detail.value,
        },
        success(res) {
          console.log(res.result)
          if (res.result.errCode == 87014) {
            wx.showToast({
              icon:'none',
              title: e.detail.value + "违规",
            })
            return
          }
          else{
            that.setData({
              textareaBValue:e.detail.value
            })
          }
        }
      })
    }, 50)
  },
  // 获取营业时间
  textareaCInput(e) {
    setTimeout(() => {
      wx.cloud.callFunction({
        name: 'checkImg',
        data: {
          msg: e.detail.value,
        },
        success(res) {
          console.log(res.result)
          if (res.result.errCode == 87014) {
            wx.showToast({
              icon:'none',
              title: e.detail.value + "违规",
            })
            return
          }
          else{
            that.setData({
              textareaCalue:e.detail.value
            })
          }
        }
      })
    }, 50)
  },

  // ****************************表单提交清空**************************
  formSubmit(e) {
    console.log(e.detail.value.title)
  },

  formReset() {
    console.log('form发生了reset事件')
  },
  js_date_time(unixtime) {
    var date = new Date(unixtime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second; //年月日时分秒
  },
  // *******************************提交表单到数据库***************************
  publishNews(e) {
    if(that.data.textareaAValue == ''){
      wx.showToast({
        icon:'none',
        title: '请输入店名',
      })
      // 直接返回,不进行操作
      return ;
    }
    if(that.data.textareaBValue == ''){
      wx.showToast({
        icon:'none',
        title: '请输入APPID',
      })
      // 直接返回,不进行操作
      return ;
    }
    if(that.data.textareaCalue == ''){
      wx.showToast({
        icon:'none',
        title: '请输入营业时间',
      })
      // 直接返回,不进行操作
      return ;
    }
    console.log("发布",e);
    that.unloadImage(that.data.imgList);
    var time = that.js_date_time(new Date())
    wx.showLoading({
      title: '发表中',
    })
    setTimeout(() => {
      db.add({
        data: {
          userInfo:that.data.userInfo,
          Store:that.data.textareaAValue,
          APPID:that.data.textareaBValue,
          DayTime:that.data.textareaCalue,
          ShiTang:that.data.index,
          XiaoQu:that.data.index1,
          time:time,
        },
        success(res) {
          console.log("添加成功", res);
          wx.hideLoading()
          wx.showToast({
            title: '发表成功',
          })
        },
        fail(res) {
          console.log("添加失败", res);
          wx.hideLoading()
        }
      })
    }, 2000);
    setTimeout(()=>{
      wx.navigateBack({
        delta: 1,
      })
    },3000)
    
  },
  // 上传图片
  unloadImage() {
    wx.cloud.uploadFile({
      cloudPath: 'WaiMaiphone/' + new Date().getTime() + "_" + Math.floor(Math.random() * 1000) + ".jpg",
      filePath: that.data.imgList[0], // 文件路径
      success: res => {
        // 返回文件 ID
        console.log(res.fileID)
        that.setData({
          imageID:res.fileID
        })
      },
      fail: console.error
    })
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