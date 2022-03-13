// pages/publish/publish.js
var that;
const app = getApp();
const db = wx.cloud.database().collection("houseX");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    // 图片临时链接
    imgList: [],
    // 图片id获取fileID
    imageID: [],
    // 获取显示昵称
    textareaAValue: '',
    textareaBValue: '',
    textareaCValue: '',
    // 表单内容
    formContent: [],
    // 时间
    time:''
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
  // 求租内容
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
  // 求租内容
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
  // 求租内容
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
  // ****************************表单提交清空**************************
  formSubmit(e) {
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
        title: '请输入联系电话',
      })
      // 直接返回,不进行操作
      return ;
    }
    if(that.data.textareaBValue == ''){
      wx.showToast({
        icon:'none',
        title: '请输入微信',
      })
      // 直接返回,不进行操作
      return ;
    }
    if(that.data.textareaCValue == ''){
      wx.showToast({
        icon:'none',
        title: '请输入内容',
      })
      // 直接返回,不进行操作
      return ;
    }
    if(that.data.imgList.length == 0){
      wx.showToast({
        icon:'none',
        title: '请选择一张图片',
      })
      // 直接返回,不进行操作
      return ;
    }
    wx.showLoading({
      title: '发表中',
    })
    that.unloadImage();
  },
  // 上传图片
  unloadImage() {
    var time = that.js_date_time(new Date());
    wx.showLoading({
      title: '上传中',
    })
    wx.cloud.uploadFile({
      // 指定上传到的云路径
      cloudPath:"HouseImage/"+ new Date().getTime() + 'news.png',
      // 指定要上传的文件的小程序临时文件路径
      filePath: that.data.imgList[0],
      // 成功回调
      success: res => {
        console.log('上传成功', res)
        that.setData({
          imageID: res.fileID
        })
        wx.showToast({
          title: '上传成功',
        })
        db.add({
          data: {
            userInfo:that.data.userInfo,
            time:time,
            contentImage: that.data.imageID,
            phone:that.data.textareaAValue,
            weChat:that.data.textareaBValue,
            content: that.data.textareaCValue,
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
        console.log(this.data.imageID);
       
      },
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