// pages/user/userInfo.js
var that
var db = wx.cloud.database()
var _ = db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        openid: null,
        nickName: null,
        avatarUrl: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log("传给userInfo得参数", options);
        that = this;
        that.setData({
            openid: options.openid,
            nickName: options.nickName,
            avatarUrl: options.avatarUrl
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    sendMsg() {
        var currentId = getApp().globalData.userInfo._openid;
        console.log("currentId:", currentId);
        var friendId = that.data.openid;
        console.log("friendId:", friendId);
        //查询和好友聊天群组，如果存在直接进入聊天界面，不存在则创建
        // type:1单聊，2群聊
        db.collection('chat_group')
            .where({
                type: 1,
                // 查询数组中是否包含这两个id，云开发SDK文档,查询数据库
                chat_members: _.all([currentId, friendId])
            })
            .get()
            .then(res => {
                console.log("查询聊天室成功", res);
                // 不存在
                if (res.data.length == 0) {
                    // 创建聊天群组
                    db.collection('chat_group')
                        .add({
                            data: {
                                type: 1,
                                chat_members: [currentId, friendId],
                                time: new Date()
                            }
                        })
                        .then(res => {
                            console.log("添加聊天室成功", res);
                            var groupId = res._id;
                            console.log("聊天室Id", groupId);
                            wx.navigateTo({
                                url: '../im/room/room?nickName=' +
                                    that.data.nickName +
                                    "&groupId=" + res.data[0]._id +
                                    "&userId=" + friendId +
                                    "&userAvatar=" + that.data.avatarUrl +
                                    "&userNickName=" + that.data.nickName +
                                    "&chatType=1",
                            })
                        })
                        .catch(err => {

                        })
                } else {
                    console.log("存在得聊天室", res.data[0]._id);
                    // 存在直接跳转
                    wx.navigateTo({
                        url: '../im/room/room?title=' +
                            that.data.nickName +
                            "&groupId=" + res.data[0]._id +
                            "&userId=" + friendId +
                            "&userAvatar=" + that.data.avatarUrl +
                            "&userNickName=" + that.data.nickName +
                            "&chatType=1",
                    })
                }
            })
            .catch(err => {

            })
            // wx.navigateTo({
            //   url: '../im/room/room?nickName=' + that.data.nickName,
            // })
            //   var currentId = getApp().globalData.userInfo._openid;
            //   var friendId = that.data.openid;
            //   // 查询和好友聊天群组 是否存在，如果存在，直接进入聊天页面，如果不存在创建
            //   // type 1 单聊，2 群聊
            //   db.collection('chat_group')
            //     .where({
            //       type: 1,
            //       chat_members: _.all([currentId, friendId])
            //     })
            //     .get()
            //     .then(res => {
            //       console.log('query success', res)
            //       // 不存在
            //       if (res.data.length == 0) {
            //         // 去创建聊天群组
            //         db.collection('chat_group')
            //           .add({
            //             data: {
            //               type: 1,
            //               chat_members: [currentId, friendId],
            //               time: new Date()
            //             }
            //           })
            //           .then(res => {
            //             console.log('add success', res)
            //             wx.navigateTo({
            //               url: '../im/room/room?title=' + that.data.nickName +
            //                 "&groupId=" + res._id + "&userId=" + friendId + "&userAvatar=" + that.data.avatarUrl + "&userNickName=" + that.data.nickName + "&chatType=1" + "&memberIds=" + JSON.stringify([currentId, friendId]),
            //             })
            //           })
            //           .catch(err => {

        //           })
        //       } else {
        //         // 存在
        //         wx.navigateTo({
        //           url: '../im/room/room?title=' + that.data.nickName +
        //             "&groupId=" + res.data[0]._id + "&userId=" + friendId + "&userAvatar=" + that.data.avatarUrl + "&userNickName=" + that.data.nickName + "&chatType=1" + "&memberIds=" + JSON.stringify([currentId, friendId]),
        //         })
        //       }
        //     })
        //     .catch(err => {

        //     })
        //   // wx.navigateTo({
        //   //   url: '../im/room/room?nickName=' + that.data.nickName
        //   //     + "&openid=" + that.data.openid,
        //   // })
    },
})