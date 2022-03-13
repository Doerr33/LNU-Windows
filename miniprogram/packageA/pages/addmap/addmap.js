// pages/publish/publish.js
var that;
const app = getApp();
const db = wx.cloud.database().collection("Location")
// const { log } = require('console');
// 获取时间
var util = require('../../../utils/utils');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 设置位置
    address: null,
    latitude: null,
    longitude: null,
    // 标签选择
    picker: ['快递', '学院', '篮球场', '教学楼', '行政楼', '食堂', '学生宿舍', '体育场所', '生活服务'],
    // 分类
    index: null,

    // 选择校区
    picker1: ['崇山校区', '蒲河校区'],
    // 标签索引
    index1: null,

    // 未知
    imgList: [],
    // 图片id获取fileID
    imageID: [],

    // 用户写的位置名称
    textareaAValue: '',
    // 表单内容
    formContent: [],
  },
  getAddLoaction(e) {
    that = this;
    console.log("选择位置");
    wx.chooseLocation({
      success: function (res) {
        console.log("选择位置成功", res);
        that.setData({
          // 选择的地址
          address: res.address,
          // 经纬度
          latitude: res.latitude,
          longitude: res.longitude,
        })
      }
    })
  },
  // 获取选择新闻或者活动的索引
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


  // 选择图片并且上传
  ChooseImage() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        console.log(res);
        this.setData({
          imgList: res.tempFilePaths
        })
        wx.showLoading({
          title: '上传中',
        })
        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: "articleImage/" + new Date().getTime() + 'news.png',
          // 指定要上传的文件的小程序临时文件路径
          filePath: res.tempFilePaths[0],
          // 成功回调
          success: res => {
            console.log('上传成功', res)
            this.setData({
              imageID: res.fileID
            })
            console.log(this.data.imageID);
            wx.showToast({
              title: '上传成功',
            })
          },
        })
      }
    });
  },
  // 显示图片
  ViewImage(e) {
    wx.previewImage({
      // 临时链接
      urls: this.data.imgList,
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
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  //输入气泡内容
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


  // ****************************表单提交清空**************************
  formSubmit(e) {
    console.log(e.detail.value.title)
  },

  formReset() {
    console.log('form发生了reset事件')
  },

  // *******************************提交表单到数据库***************************
  publishAddLocation() {
    var timestamp = Date.parse(new Date());
    that = this;
    wx.showLoading({
      title: '发表中',
    })
    if (that.data.textareaAValue == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入位置名字',
      })
      // 直接返回,不进行操作
      return;
    }
    if (that.data.latitude == null && that.data.longitude == null) {
      wx.showToast({
        icon: 'none',
        title: '请选择位置',
      })
      // 直接返回,不进行操作
      return;
    }
    var callcoutname = that.data.textareaAValue;
    console.log("气泡名字", callcoutname);
    var callout = {
      content: callcoutname,
      borderColor: "red",
      borderRadius: 5,
      borderWidth: 1,
      bgColor: '#ffffff',
      display: "ALWAYS",
      fontSize: 13,
      padding: 2,
    }
    //  调用ContentCheck云函数检查文字是否违规
    wx.cloud.callFunction({
      name: 'ContentCheck',
      data: {
        msg: that.data,
      },
      success(res) {
        console.log(res)
        if (res.errCode == 87014) {
          wx.showToast({
            title: '文字违规',
          })
        }
      }
    })
    wx.cloud.callFunction({
        name: 'addmap',
        data: {
          id: timestamp,
          Location: callcoutname,
          classify: that.data.index,
          school: that.data.index1,
          latitude: that.data.latitude,
          longitude: that.data.longitude,
          address: that.data.address,
          callout: callout,
        }
      })
      .then(res => {
        console.log("添加成功", res);
        wx.hideLoading()
        wx.showToast({
          title: '添加成功',
        })
        wx.navigateBack({
          delta: 1,
        })
      })
      .catch(err => {
        console.error("添加失败", err);
        wx.showToast({
          icon: none,
          title: '添加失败',
        })
      })
  },
  // 上传图片
  unloadImage(fileUrl) {
    wx.cloud.uploadFile({
      // 指定上传到的云路径
      cloudPath: 'my-photo.png',
      // 指定要上传的文件的小程序临时文件路径
      filePath: fileUrl,
      // 成功回调
      success: res => {
        console.log('上传成功', res)
        this.setData({
          imageID: res.fileID
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
  },

})