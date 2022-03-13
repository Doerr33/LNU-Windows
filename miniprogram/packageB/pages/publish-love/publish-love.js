// pages/publish/publish.js
var that;
const app = getApp();
const MAX_IMG_NUM = 9;
const db = wx.cloud.database().collection("loveList")
// 获取时间
var util = require('../../../utils/utils');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    // 字数统计
    textLength:0,
    images:[],
    maxCount:9,
    images_upload_success: [], // 图片上传成功后的云端图片地址数组
    images_upload_success_size: 0, // 图片上传成功的数量
    modalName: null,
    // 获取显示昵称
    textareaBValue: '',
    // 获取表白内容
    textareaDValue:'',
    // 表单内容
    formContent: [],
    // 时间
    time:''
  },
  // 选择图片并且上传
  ChooseImage() {
    let max = MAX_IMG_NUM - this.data.images.length;
    wx.chooseImage({
      count: max,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => { // 这里若不是箭头函数,那么下面的this.setData的this要换成that上面的临时变量,作用域的问题,不清楚的,可以看下this指向相关的知识
        console.log(res)
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFiles = res.tempFiles;
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
        // 在选择图片时,对本地临时存储的图片,这个时候,进行图片的校验,当然你放在最后点击发布时,进行校验也是可以的,只不过是一个前置校验和后置校验的问题,我个人倾向于在选择图片时就进行校验的,选择一些照片时,就应该在选择时阶段做安全判断的, 小程序端请求云函数方式
        // 图片转化buffer后，调用云函数
        console.log(tempFiles);
        tempFiles.forEach(items => {
          console.log(items);
          // 图片转化buffer后，调用云函数
          wx.getFileSystemManager().readFile({
            filePath: items.path,
            success: res => {
              console.log(res);
              wx.showLoading({
                title: '图片检查中',
              })
              wx.cloud.callFunction({
                  name: 'ContentCheck',
                  data: {
                    img: res.data
                  }
                })
                .then(res => {
                  console.log(res);
                  var errCode = res.result.errCode
                  switch (errCode) {
                    case 87014:
                      wx.showToast({
                        icon:'none',
                        title: '内容违规,请重新选择图片',
                      })
                      this.data.images.splice(this.data.images.length - 1,1);
                      this.setData({
                        images: this.data.images
                      })
                      break;
                    case 0:
                      wx.showToast({
                        title: '图片安全',
                      })
                      this.setData({
                        resultText: '内容OK'
                      })
                      break;
                    default:
                      wx.showToast({
                        title: '图片安全',
                      })
                      this.setData({
                        resultText: '内容OK'
                      })
                      break;
                  }

                })
                .catch(err => {
                  console.error(err);
                })
            },
            fail: err => {
              console.error(err);
            }
          })
        })
        // 还能再选几张图片
        max = MAX_IMG_NUM - this.data.images.length
        this.setData({
          selectPhoto: max <= 0 ? false : true // 当超过9张时,加号隐藏
        })
      },
    })
  },
  // 显示图片
  ViewImage(e) {
    wx.previewImage({
      // 临时链接
      urls: this.data.images,
      current: e.currentTarget.dataset.url
    });
  },
  // 删除图片
  DelImg(e) {
    wx.showModal({
      title: '删除',
      content: '是否删除',
      cancelText: '否',
      confirmText: '是',
      success: res => {
        if (res.confirm) {
          this.data.images.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            images: this.data.images
          })
        }
      }
    })
  },
  // 表白内容
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
  // ****************************表单提交清空**************************
  formSubmit(e) {
    console.log(e)
  },

  formReset() {
    console.log('form发生了reset事件')
  },

  // *******************************提交表单到数据库***************************
  publishNews() {
    var time = this.js_date_time(new Date())
    console.log("当前时间",time);
    that.data.time = time;
    // 表单验证也可以这么做
    // 如果文字填写内容为空 并且 没有添加图片 给用户提示
    if(that.data.textareaBValue.trim().length==0 && that.data.images.length==0){
      wx.showToast({
        icon:'none',
        title: '内容不能为空',
      })
      // 直接返回,不进行操作
      return ;
    }
     //  调用ContentCheck云函数检查图片是否违规
     wx.cloud.callFunction({
      name: 'ContentCheck',
      data: {
        img: that.data.images[0]
      },
      success(res) {
        console.log("图片鉴黄",res)
        if (res.errCode == 87014) {
          wx.showToast({
            title: '图片违规',
          })
        }
      }
    })
    wx.showLoading({
      title: '发布中',
    })
    if(that.data.images.length > 0){
      that.setData({
        images_upload_success:that.data.images
      })
      that.uploadImage(0);
    }
    else{
      that.circleAdd();
    }
  },
  uploadImage(index){
    wx.cloud.uploadFile({
      cloudPath: 'phonecircle_/' + new Date().getTime() + "_" + Math.floor(Math.random() * 1000) + ".jpg",
      filePath: that.data.images[index], // 文件路径
      success:res=>{
        console.log(res.fileID);
        that.data.images_upload_success[index] = res.fileID;
        that.data.images_upload_success_size = that.data.images_upload_success_size + 1;
        
        if(that.data.images_upload_success_size == that.data.images.length){
          console.log("success上传图片:", that.data.images_upload_success)
          that.circleAdd();
        }
        else{
          that.uploadImage(index + 1);
        }
      },
      fail:err=>{
        console.log(err);
        that.setData({
          images_upload_success:[],
          images_upload_success_size:0
        })
        wx.hideLoading()
        wx.showToast({
          icon:"none",
          title: '图片上传失败',
        })
      }
    })
  },
  circleAdd(){
    // 将发布的朋友圈信息，添加进云端数据库
    db.add({
      data:{
        userInfo:that.data.userInfo,
        content:that.data.textareaBValue,
        images:that.data.images_upload_success,
        time:that.data.time,
        loveList:[],
        commentList:[],
      }
    }).then(res=>{
      console.log('add love success:', res)
      wx.hideLoading()
      wx.showToast({
        title: '发布成功'
      })
      wx.navigateBack({
        delta: 1,
      })

    }).catch(error=>{
      console.log('add circle error:', error)
      wx.hideLoading()
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    // 获取用户信息，登录界面存储到本地
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