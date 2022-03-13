// pages/publish/publish.js
var that;
const app = getApp();
const db = wx.cloud.database().collection("car")
// 获取时间
var util = require('../../../utils/utils');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    // 图片列表
    images: [],
    // 视频
    video: '',
    // 图片临时链接
    videoList: [],
    // 头像临时链接
    imgList1: [],
    // 图片id获取fileID
    videoID: [],
    // 头像id获取fileID
    imageID1: [],
    // 名称
    textareaValue: '',
    // 获取介绍
    textareaAValue: '',
    // 获取地址
    textareaBValue: '',
    // 价格
    textareaCValue: '',
    // 获取接送
    textareaDValue: '',
    // 获取下证时间
    textareaEValue: '',
    // 获取电话
    textareaFValue: '',
    formContent: [],
    // 时间
    time: ''
  },
  // 输入名称
  textareaInput(e) {
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
              textareaValue:e.detail.value
            })
          }
        }
      })
    }, 50)
  },
  // 输入介绍
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
  // 输入地点
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
  // 输入价格
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
              textareaCValue:e.detail.value
            })
          }
        }
      })
    }, 50)
  },
  // 接送
  textareaDInput(e) {
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
              textareaDValue:e.detail.value
            })
          }
        }
      })
    }, 50)
  },
  // 输入下证
  textareaEInput(e) {
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
              textareaEValue:e.detail.value
            })
          }
        }
      })
    }, 50)
  },
  // 输入电话
  textareaFInput(e) {
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
              textareaFValue:e.detail.value
            })
          }
        }
      })
    }, 50)
  },
  // ****************************表单提交清空**************************
  formSubmit(e) {
    
  },

  formReset() {
    console.log('form发生了reset事件')
  },

  // *******************************提交表单到数据库***************************
  publishNews() {
    if(that.data.textareaValue == ''){
      wx.showToast({
        icon:'none',
        title: '请输入驾校名称',
      })
      // 直接返回,不进行操作
      return ;
    }
    if(that.data.textareaAValue == ''){
      wx.showToast({
        icon:'none',
        title: '请输入介绍',
      })
      // 直接返回,不进行操作
      return ;
    }
    if(that.data.textareaBValue == ''){
      wx.showToast({
        icon:'none',
        title: '请输入地址',
      })
      // 直接返回,不进行操作
      return ;
    }
    if(that.data.textareaCValue == ''){
      wx.showToast({
        icon:'none',
        title: '请输入价格',
      })
      // 直接返回,不进行操作
      return ;
    }
    if(that.data.textareaDValue == ''){
      wx.showToast({
        icon:'none',
        title: '是否接送',
      })
      // 直接返回,不进行操作
      return ;
    }
    if(that.data.textareaEValue == ''){
      wx.showToast({
        icon:'none',
        title: '请输入下证时间',
      })
      // 直接返回,不进行操作
      return ;
    }
    if(that.data.textareaFValue == ''){
      wx.showToast({
        icon:'none',
        title: '请输入电话',
      })
      // 直接返回,不进行操作
      return ;
    }
    if(that.data.textareaFValue == ''){
      wx.showToast({
        icon:'none',
        title: '请输入电话',
      })
      // 直接返回,不进行操作
      return ;
    }
    if(that.data.video.length == 0){
      wx.showToast({
        icon:'none',
        title: '请选择视频上传',
      })
      // 直接返回,不进行操作
      return ;
    }
    wx.showLoading({
      title: '发表中',
    })
    that.uploadVideo();
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

  },
  // 上传视频
  chooseVideo() {
    // 弹层  
    wx.showToast({
      title: '选择视频',
      icon: 'none',
      duration: 2000,
      success: res => {
        wx.chooseVideo({
          sourceType: ['album', 'camera'],
          compressed: true,
          maxDuration: 60,
          camera: 'back',
          success: res => {
            console.log(res);
            const video = res.tempFilePath;
            this.setData({
              video:video
            })
          }
        })
      }
    })
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
  uploadVideo(e){
    var time = that.js_date_time(new Date());
    wx.showLoading({
      title: '上传中',
    })
    wx.cloud.uploadFile({
      // 指定上传到的云路径
      cloudPath: "驾校/" + new Date().getTime() + 'cars.mp4',
      // 指定要上传的文件的小程序临时文件路径
      filePath: that.data.video,
      // 成功回调
      success: res => {
        console.log('上传成功', res)
        this.setData({
          videoID: res.fileID
        })
        wx.showToast({
          title: '上传成功',
        })
        db.add({
          data: {
            shenHe:'',
            CarName:that.data.textareaValue,
            CarJieShao:this.data.textareaAValue,
            userInfo:that.data.userInfo,
            time: time,
            addr: this.data.textareaBValue,
            price: this.data.textareaCValue,
            jiesong: this.data.textareaDValue,
            TakeTime: this.data.textareaEValue,
            phone:this.data.textareaFValue,
            VideoID:this.data.videoID,
          },
          success(res) {
            console.log("添加成功", res);
            wx.hideLoading()
            wx.navigateBack({
              delta: 1, // 回退前 delta(默认为1) 页面 
            })
            wx.showToast({
              title: '发表成功',
            })
          },
          fail(res) {
            console.log("添加失败", res);
          }
        })
        console.log(this.data.videoID);
        
      },
    })
  },
  // 删除视频
  videoDelete() {
    wx.showModal({
      title: '警告',
      content: '确定要删除该视频吗',
      success: res => {
        if (res.confirm) {
          this.setData({
            video: ''
          })
        }
      }
    })
  },
  // 表单提交事件
  submitClick() {

  },
  // 重置表单
  resetClick() {
    wx.showModal({
      title: '警告',
      content: '重置表单将需要重新上传数据',
      success: res => {
        if (res.confirm) {
          this.setData({
            titleCount: 0,
            contentCount: 0,
            title: '',
            content: '',
            images: [],
            video: ''
          })
        }
      }
    })
  }

})