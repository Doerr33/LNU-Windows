// pages/publish/publish.js
const app = getApp();
var that;
const db = wx.cloud.database().collection("news")
// 获取时间
var util = require('../../../utils/utils');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    // 未知
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    // 标签选择
    picker: ['新闻', '活动'],
    // 标签索引
    index: null,
    // 未知
    multiIndex: [0, 0, 0],
    // 选择时间传入的参数，没有用到
    date: '2018-12-25',
    // 图片列表获取临时链接
    imgList: [],
    // 图片id获取fileID
    imageID: [],
    modalName: null,
    // 获取标题
    textareaAValue: '',
    // 获取内容
    textareaBValue: '',
    // 获取作者
    textareaCValue: '',
    // 获取组织名称
    textareaDValue: '',
    // 表单内容
    formContent: [],
    // 时间
    time: ''
  },

  // 获取选择新闻或者活动的索引
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
    console.log("a", e.detail.value);
  },
  // 未知
  MultiChange(e) {
    this.setData({
      multiIndex: e.detail.value
    })
    console.log("b", e.detail.value);
  },
  // 未知
  RegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
    console.log(e.detail.value);
  },
  // 选择图片并且上传
  ChooseImage() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        const tempFiles = res.tempFiles;
        console.log(res);
        that.setData({
          imgList: res.tempFilePaths
        })
        tempFiles.forEach(items => {
          console.log(items);
          // 图片转化buffer后，调用云函数
          wx.getFileSystemManager().readFile({
            filePath: items.path,
            success: res => {
              wx.showLoading({
                icon:'none',
                title: '图片鉴黄中',
              })
              console.log(res);
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
                      this.data.imgList.splice(that.data.imgList, 1);
                      this.setData({
                        imgList: this.data.imgList
                      })
                      this.setData({
                        resultText: '内容含有违法违规内容'
                      })
                      break;
                    case 0:
                      wx.showToast({
                        title: '图片安全',
                      })
                      break;
                    default:
                      wx.showToast({
                        title: '内容安全',
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
        console.log("临时图片链接：", res.tempFilePaths);
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
  textareaAInput(e) {
    console.log(e.detail.value);
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
  // 输入作者
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
  // 最后的内容输入框，textareaBValue获取变量
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

  // ****************************表单提交清空**************************
  formSubmit(e) {
    console.log(e.detail.value.title)
  },

  formReset() {
    console.log('form发生了reset事件')
  },

  // *******************************提交表单到数据库***************************
  publishNews() {
    if (that.data.textareaAValue == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入名称',
      })
      // 直接返回,不进行操作
      return;
    }
    if (that.data.textareaBValue == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入标题',
      })
      // 直接返回,不进行操作
      return;
    }
    if (that.data.textareaCValue == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入作者',
      })
      // 直接返回,不进行操作
      return;
    }
    if (that.data.textareaDValue == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入活动具体内容',
      })
      // 直接返回,不进行操作
      return;
    }
    if (that.data.imgList.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '请选择图片',
      })
      // 直接返回,不进行操作
      return;
    }
    // 内容检测

    wx.showLoading({
      title: '发表中',
    })
    that.unloadImage();
    setTimeout(() => {
      db.add({
        data: {
          comment: [],
          like: [],
          group: that.data.textareaAValue,
          title: that.data.textareaBValue,
          actor: that.data.textareaCValue,
          content: that.data.textareaDValue,
          tag: that.data.index,
          time: that.data.time,
          imageUrl: that.data.imageID,
          userInfo: that.data.userInfo
        },
        success: function (res) {
          console.log("news publish success:", res);
          wx.hideLoading()
          wx.showToast({
            title: '发表成功',
          })
        }
      })
    }, 2000);
    setTimeout(() => {
      wx.navigateBack({
        delta: 1,
      })
    }, 3000)

  },
  // 上传图片
  unloadImage() {
    wx.cloud.uploadFile({
      cloudPath: 'news_images/' + new Date().getTime() + "_" + Math.floor(Math.random() * 1000) + ".jpg",
      filePath: that.data.imgList[0], // 文件路径
      success: res => {
        // 返回文件 ID
        console.log(res.fileID)
        that.setData({
          imageID: res.fileID
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
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      time: time
    });
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        that.setData({
          userInfo: JSON.parse(res.data)
        })
      }
    })
  },
})