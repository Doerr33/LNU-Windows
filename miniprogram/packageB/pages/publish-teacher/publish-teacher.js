// pages/publish/publish.js
var that;
const app = getApp();
const db = wx.cloud.database().collection("teacher")
// 获取时间
var util = require('../../../utils/utils');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    // 外卖分类
    // 分类id
    picker: ["炸鸡汉堡", "饮品甜点", "零食超市", "粉面水饺", "香锅麻辣", "大型聚餐", "生鲜果蔬", "校内跑腿", "水果捞", "今日特价", "校园美妆", "校园摄影", "其他"],
    index: null,
    picker1: ['崇山校区', '蒲河校区'],
    index1: null,
    picker2: ['大一', '大二','大三','大四','研究生','博士生'],
    index2: null,
    picker3: ['否', '是'],
    index3: null,
    // 获取专业
    textareaAValue:'',
    // 获取价格
    textareaBValue:'',
    // 获取电话
    textareaCValue:'',
    // 获取微信
    textareaDValue:'',
    // 获取详细教育经历
    textareaEValue:'',
    // 表单内容
    formContent: [],
    // 时间
    time:''
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
  PickerChange2(e) {
    console.log(e);
    this.setData({
      index2: e.detail.value
    })
    console.log("a", e.detail.value);
  },
  PickerChange3(e) {
    console.log(e);
    this.setData({
      index3: e.detail.value
    })
    console.log("a", e.detail.value);
  },
  // 输入专业
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
  // 输入价格
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
  // 输入电话
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
   // 输入微信
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
   // 输入详细教育经历
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
  publishNews() {
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
    var time = that.js_date_time(new Date())
    wx.showLoading({
      title: '发表中',
    })
    var subject;
    if(that.data.index == null){
      subject = "炸鸡汉堡";
    }
    else{
      subject = that.data.picker[that.data.index];
    }
    var school;
    if(that.data.index1 == null){
      school = "崇山校区";
    }
    else{
      school = that.data.picker1[that.data.index1];
    }
    var classF;
    // if(that.data.index2 == null){
    //   classF = "大一";
    // }
    // else{
    //   classF = that.data.picker2[that.data.index2];
    // }
    // var exper;
    // if(that.data.index3 == null){
    //   exper = "否";
    // }
    // else{
    //   exper = that.data.picker3[that.data.index3];
    // }
    setTimeout(() => {
      db.add({
        data: {
          userInfo:that.data.userInfo,
          GuanFang:'',
          subject:subject,
          XiaoQu:school,
          class:classF,
          Store:that.data.textareaAValue,
          APPID:that.data.textareaBValue,
          time:time,
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
    }, 2000);
    setTimeout(()=>{
      wx.navigateBack({
        delta: 1,
      })
    },3000)
    
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