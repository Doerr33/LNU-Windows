// miniprogram/pages/imgSecCheck/imgSecCheck.js
// 最大上传图片数量
var that;
const MAX_IMG_NUM = 9;

const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: [],
    selectPhoto: true, // 添加图片元素是否显示
    content: '',
  },
  bindInputCon(e) {
    console.log(e.detail.value);
    //  调用ContentCheck云函数检查文字是否违规
    that.data.content = e.detail.value;
    wx.cloud.callFunction({
      name: 'checkImg',
      data: {
        msg: that.data.content,
      },
      success(res) {
        console.log(res.result)
        if (res.result.errCode == 87014) {
          wx.showToast({
            title: '文字违规',
          })
          return
        }
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
  },
  // 选择图片
  onChooseImage() {
    // const that = this;  // 如果下面用了箭头函数,那么这行代码是不需要的,直接用this就可以了的
    // 还能再选几张图片,初始值设置最大的数量-当前的图片的长度
    let max = MAX_IMG_NUM - this.data.images.length;
    wx.chooseImage({
      count: max,
      sizeType: ['original', 'compressed'],
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
              wx.cloud.callFunction({
                  name: 'ContentCheck',
                  data: {
                    img: res.data
                  }
                })
                .then(res => {
                  console.log(res);
                  var errCode = res.result.imageR.errCode
                  switch (errCode) {
                    case 87014:
                      this.setData({
                        resultText: '内容含有违法违规内容'
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

  // 删除图片
  onDelImage(event) {
    const index = event.target.dataset.index;
    // 点击删除当前图片,用splice方法,删除一张,从数组中移除一个
    this.data.images.splice(index, 1);
    this.setData({
      images: this.data.images
    })
    // 当添加的图片达到设置最大的数量时,添加按钮隐藏,不让新添加图片
    if (this.data.images.length == MAX_IMG_NUM - 1) {
      this.setData({
        selectPhoto: true,
      })
    }
  },
})