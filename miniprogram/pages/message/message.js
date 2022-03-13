// pages/message/message.js
var that;
var db = wx.cloud.database()
var _ = db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {

        openid: '',
        currentIndex: 0,
        showOperationPannel: false,
        operationList: [],
        userInfo: null,
        msgList: [],
        friendIds: [],
        list: [{
                "text": "不信",
                "iconPath": "../../../images/weixin.png",
                "selectedIconPath": "../../../images/weixin_active.png",
            },
            {
                "text": "通讯录",
                "iconPath": "../../images/tongxunlu.png",
                "selectedIconPath": "../../images/tongxunlu_active.png",
            },
            {
                "text": "发现",
                "iconPath": "../../images/faxian.png",
                "selectedIconPath": "../../images/faxian_active.png",
            },
            {
                "text": "我的",
                "iconPath": "../../images/wode.png",
                "selectedIconPath": "../../images/wode_active.png",
            }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        that = this;
        that.setData({
            userInfo: getApp().globalData.userInfo,
            openid: getApp().globalData.userInfo._openid
        })
        that.getMsgList();
        that.initOperationList();
    },
    addFriend() {
        if (that.data.showOperationPannel) {
            that.setData({
                showOperationPannel: false
            })
        } else {
            that.setData({
                showOperationPannel: true
            })
        }
        // wx.navigateTo({
        //   url: '../search/search',
        // })
    },
    clickOperationItem(e) {
        console.log(e);
        var index = e.currentTarget.dataset.index;
        if (index == 0) {
            // 跳转发起群聊页面
            wx.navigateTo({
                url: '/packageB/pages/qunLiao/qiaoLiao',
            })
        }
        if (index == 1) {
            // 跳转添加好友页面
            wx.navigateTo({
                url: '/packageB/pages/search/search',
            })
        }
        that.setData({
            showOperationPannel: false
        })
    },
    clickQL(e) {
        console.log(e);
    },
    // addFriend() {
    //   wx.navigateTo({
    //     url: '/packageA/pages/cat',
    //   })
    // },
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

    // 点击消息
    clickMsg(e) {
        var index = e.currentTarget.dataset.index;
        console.log(index);
        var msg = that.data.msgList[index];
        // 系统消息是0，如果是系统消息则不传递chatType
        var chatType = '';
        // 判断不是群聊消息
        if (msg.type == 1 || msg.type == 2) {
            chatType = "&chatType=" + msg.type;
        }
        var title = msg.title;
        if (msg.type == 2) {
            title = '群聊(' + msg.userIds.length + ')';
        }
        console.log(msg);
        wx.navigateTo({
            url: '../im/room/room?title=' + title +
                "&groupId=" + msg.groupId + chatType,
        })
    },


    initWatch() {
        var timeTS = Date.now();
        if (that.data.msgList.length > 0) {
            timeTS = that.data.msgList[0].sendTimeTS;
        }
        console.log('启动消息列表监听', timeTS)
        db.collection('sys_msg')
            // 筛选语句
            .where({
                userIds: _.in([that.data.openid]),
                sendTimeTS: _.gt(timeTS)
            })
            // 发起监听
            .watch({
                onChange: function(snapshot) {
                    console.log('snapshot', snapshot)
                    const msgs = [...that.data.msgList]
                    for (const docChange of snapshot.docChanges) {
                        switch (docChange.dataType) {
                            case 'add':
                            case 'update':
                                {
                                    const ind = msgs.findIndex(msg => msg._id === docChange.doc._id)
                                    docChange.doc.time = that.js_date_time(docChange.doc.time)
                                    var msg = docChange.doc;
                                    // 重构到全局
                                    msg = setMsgValue(msg)
                                    // msg = setMsgValue(msg);
                                    // msg.unreadCount = msgs[ind].unreadCount;
                                    if (ind > -1) {
                                        msgs.splice(ind, 1, docChange.doc)
                                    } else {
                                        msgs.push(docChange.doc)
                                    }
                                    break
                                }
                        }
                    }
                    that.setData({
                        msgList: msgs.sort((x, y) => y.sendTimeTS - x.sendTimeTS),
                    })
                    wx.setStorage({
                        data: JSON.stringify(that.data.msgList),
                        key: 'msgList',
                    })
                },
                onError: function(err) {
                    console.error('the watch closed because of error', err)
                }
            })
    },
    updatePushMsg(id) {
        db.collection('push_msg')
            .where({
                _id: id
            })
            .update({
                data: {
                    arrive: 1
                }
            })
            .then(res => {
                console.log('更新推送消息', res)
            })
    },
    // 推送消息监听
    initWatchPush() {
        var timeTS = Date.now();
        if (that.data.msgList.length > 0) {
            timeTS = that.data.msgList[0].sendTimeTS;
        }
        console.log('启动推送消息监听', timeTS)
        db.collection('push_msg')
            // 筛选语句
            .where({
                userId: that.data.openid,
                sendTimeTS: _.gt(timeTS)
            })
            // 发起监听
            .watch({
                onChange: function(snapshot) {
                    console.log('接收到推送消息监听', snapshot)
                    const msgs = [...that.data.msgList]
                    for (const docChange of snapshot.docChanges) {
                        switch (docChange.dataType) {
                            case 'add':
                            case 'update':
                                {
                                    const ind = msgs.findIndex(msg => msg.groupId === docChange.doc.groupId)
                                    docChange.doc.time = js_date_time(docChange.doc.time)
                                    var pushMsg = docChange.doc;
                                    that.updatePushMsg(pushMsg._id);
                                    if (ind > -1) {
                                        // 如果是聊天类型
                                        if (pushMsg.type == 2) {

                                            // 如果是主动退出群聊，删除消息列表中消息
                                            if (pushMsg.groupType == 'group_quit') {
                                                msgs.splice(ind, 1);
                                            }

                                            // 如果是被移出群聊，不删除消息列表中消息，添加一个被删除标记
                                            if (pushMsg.groupType == 'group_delete') {
                                                msgs[ind].content = '您被' + msgs[ind].creator.nickName + '移出群聊';
                                                msgs[ind].groupType = 'group_delete';
                                                for (var j = 0; j < msgs[ind].userIds.length; j++) {
                                                    if (msgs[ind].userIds[j] == item.userId) {
                                                        msgs[ind].userIds.splice(j, 1);
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    break
                                }
                        }
                    }
                    that.setData({
                        msgList: msgs.sort((x, y) => y.sendTimeTS - x.sendTimeTS),
                    })
                    wx.setStorage({
                        data: JSON.stringify(that.data.msgList),
                        key: 'msgList',
                    })
                },
                onError: function(err) {}
            })
    },
    // 初始化面板数据
    initOperationList() {
        var list = [];
        for (var i = 0; i < 2; i++) {
            var item = {};
            if (i == 0) {
                item.imageUrl = "../../images/qunliao-white.png";
                item.text = "发起群聊";
            }
            if (i == 1) {
                item.imageUrl = "../../images/tianjiahaoyou-white.png";
                item.text = "添加好友";
            }
            list.push(item);
        }

        that.setData({
            operationList: list
        })
    },
    // 获取消息列表
    getMsgList() {
        db.collection('sys_msg')
            .where({
                // 这里用了all
                userIds: _.all([that.data.openid])
            })
            .orderBy('sentTimeTS', 'desc')
            .get()
            .then(res => {
                console.log("消息列表", res);
                that.setData({
                    msgList:res.data
                })
                if (res.data.length > 0) {
                    const msgs = [...that.data.msgList]
                    for (var i = 0; i < res.data.length; i++) {
                        res.data[i].time = this.js_date_time(res.data[i].time)
                        var item = res.data[i];
                        // 单聊的判断
                        // 抽取重构到全局
                        item =  setMsgValue(item);

                        const ind = msgs.findIndex(msg => msg._id === item._id)
                        if (ind > -1) {
                            msgs.splice(ind, 1, item)
                        } else {
                            msgs.push(item)
                        }
                    }
                    // that.setData({
                    //    msgList: res.data
                    // })
                    that.setData({
                        msgList: msgs.sort((x, y) => y.sendTimeTS - x.sendTimeTS),
                    })
                    wx.setStorage({
                        data: JSON.stringify(that.data.msgList),
                        key: 'msgList',
                    })
                    that.data.msgList.forEach(element => {
                        var item = {};
                        that.data.animateArr.push(item);
                    });
                }
                that.initWatch();
                that.getPushMsgList();
                that.getUnreadCount()
            })
            .catch(err => {

            })
    },
    getLocalMsgList() {
        var listStr = wx.getStorageSync('msgList');
        if (listStr) {
            that.setData({
                msgList: JSON.parse(listStr)
            })
        }
        console.log('getLocalMsgList', that.data.msgList)
        that.getMsgList();
    },
    getPushMsgList() {
        db.collection('push_msg')
            .where({
                userId: that.data.openid,
                // 不等于1
                arrive: _.neq(1)
            })
            .get()
            .then(res => {
                console.log('获取推送消息', res)
                if (res.data.length > 0) {
                    const msgs = [...that.data.msgList]
                    for (var i = 0; i < res.data.length; i++) {
                        var item = res.data[i];
                        var ind = msgs.findIndex(msg => msg.groupId === item.groupId)
                        item.time = this.js_date_time(item.time)
                        var pushMsg = item;
                        that.updatePushMsg(item._id);
                        if (ind > -1) {
                            // 如果是聊天类型
                            if (pushMsg.type == 2) {

                                // 如果是主动退出群聊，删除消息列表中消息
                                if (pushMsg.groupType == 'group_quit') {
                                    msgs.splice(ind, 1);
                                }

                                // 如果是被移出群聊，不删除消息列表中消息，添加一个被删除标记
                                if (pushMsg.groupType == 'group_delete') {
                                    msgs[ind].content = '您被' + msgs[ind].creator.nickName + '移出群聊';
                                    msgs[ind].groupType = 'group_delete';
                                    for (var j = 0; j < msgs[ind].userIds.length; j++) {
                                        if (msgs[ind].userIds[j] == item.userId) {
                                            msgs[ind].userIds.splice(j, 1);
                                            break;
                                        }
                                    }
                                }
                            }
                        }


                    }
                    that.setData({
                        msgList: msgs.sort((x, y) => y.sendTimeTS - x.sendTimeTS),
                    })
                    wx.setStorage({
                        data: JSON.stringify(that.data.msgList),
                        key: 'msgList',
                    })
                }
                that.initWatchPush();
            })
    },
    getUnreadCount() {
        db.collection('unread_count')
            .where({
                userId: that.data.openid,
                count: _.neq(0)
            })
            .get()
            .then(res => {
                console.log('getUnreadCount', res)
                if (res.data.length > 0) {
                    const msgs = [...that.data.msgList]
                    for (var i = 0; i < res.data.length; i++) {
                        var item = res.data[i];
                        var ind = msgs.findIndex(msg => msg.groupId === item.groupId)
                        if (ind > -1) {
                            msgs[ind].unreadCount = item.count;
                        }
                    }
                    that.setData({
                        msgList: msgs.sort((x, y) => y.sendTimeTS - x.sendTimeTS),
                    })
                    wx.setStorage({
                        data: JSON.stringify(that.data.msgList),
                        key: 'msgList',
                    })
                }
                //that.setTabbarUnreadCount();
                that.initWatchUnreadCount();
            })
    },

    initWatchUnreadCount() {
        var timeTS = Date.now();
        if (that.data.msgList.length > 0) {
            timeTS = that.data.msgList[0].sendTimeTS;
        }
        console.log('启动未读数监听', timeTS)
        db.collection('unread_count')
            // 筛选语句
            .where({
                userId: that.data.openid,
                sendTimeTS: _.gt(timeTS)
            })
            // 发起监听
            .watch({
                onChange: function(snapshot) {
                    console.log('接收到未读数监听', snapshot)
                    const msgs = [...that.data.msgList]
                    for (const docChange of snapshot.docChanges) {
                        switch (docChange.dataType) {
                            case 'add':
                            case 'update':
                                {
                                    const ind = msgs.findIndex(msg => msg.groupId === docChange.doc.groupId)
                                    if (ind > -1) {
                                        msgs[ind].unreadCount = docChange.doc.count
                                    }
                                    break
                                }
                        }
                    }
                    that.setData({
                        msgList: msgs.sort((x, y) => y.sendTimeTS - x.sendTimeTS),
                    })
                    wx.setStorage({
                        data: JSON.stringify(that.data.msgList),
                        key: 'msgList',
                    })
                    that.setTabbarUnreadCount();
                },
                onError: function(err) {}
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
        // 显示页面时需要判度是否登录，未登录则跳转登录
        if (getApp().globalData.userInfo) {
            that.setData({
                    userInfo: getApp().globalData.userInfo,
                    openid: getApp().globalData.userInfo._openid
                })
                // that.getCitys();
            that.initOperationList();
            that.getLocalMsgList();
            that.getPushMsgList();
        } else {
            wx.navigateTo({
                url: '../login/login',
            })
        }
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
        that.getMsgList()
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

    }
})

function setMsgValue(msg) {
    if (msg.type == 1) {
        //如果是聊天消息，
        var icon = "";
        var title = "";
        if (msg.users[0]._openid == that.data.openid) {
            icon = msg.users[1].avatarUrl;
            title = msg.users[1].nickName;
        } else {
            icon = msg.users[0].avatarUrl;
            title = msg.users[0].nickName;
        }
        msg.icon = icon;
        msg.title = title;
    }
    // 群聊的判断
    if (msg.type == 2) {
        var icon = '/images/qunliao-blue.png';
        var content = msg.content;
        // 群主显示
        if (msg.creator._openid == that.data.openid) {
            if (msg.childType = 'chat_sys') {
                // 如果群聊中的消息是系统聊天消息
                content = '您发送了: ' + content;
                if (msg.groupType == 'group_delete') {
                    content = '';
                    content = '您将' + msg.content + '移除群聊';
                }
                if (msg.groupType == 'group_add') {
                    content = '';
                    content = '您邀请' + msg.content + '加入群聊';
                }
                if (msg.groupType == 'group_quit') {
                    content = '';
                    // 判断是否是退出者
                    if (msg.opIds.indexOf(that.data.openid) >= 0) {
                        content = '';
                        content = '您已退出群聊';
                    } else {
                        content = msg.content + '推出群聊';
                    }
                }
            }
        } else {
            // 显示是谁发送了群聊消息
            var str = msg.creator.nickName + ": ";
            if (msg.childType == 'chat_sys') {
                str = msg.creator.nickName + " ";
            }
            // 其他用户
            content = str + content;
            if (msg.childType == 'chat_sys' && msg.groupType == 'group_delete') {
                // 被移除人
                content = '';
                if (msg.opIds.indexOf(that.data.openid) >= 0) {
                    content = '';
                    content = '您被' + msg.creator.nickName + '移出群聊';
                }

                // 其他群成员
                else {
                    content = msg.content + '被' + msg.creator.nickName + '移出群聊';
                }
            }
            if (msg.childType == 'chat_sys' && msg.groupType == 'group_quit') {
                // 被移除人
                content = '';
                if (msg.opIds.indexOf(that.data.openid) >= 0) {
                    content = '';
                    content = '您已退出群聊';
                }

                // 其他群成员
                else {
                    content = msg.content + '退出群聊';
                }
            }
        }
        msg.content = content;
        msg.icon = icon;
    }
    return msg;
}
