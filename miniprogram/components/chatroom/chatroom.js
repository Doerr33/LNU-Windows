const FATAL_REBUILD_TOLERANCE = 10
const SETDATA_SCROLL_TO_BOTTOM = {
    scrollTop: 100000,
    scrollWithAnimation: true,
}
Component({
    properties: {
        envId: String,
        collection: String,
        groupId: String,
        chatType: Number,
        userId: String,
        userNickName: String,
        userAvatar: String,
        groupName: String,
        userInfo: Object,
        onGetUserInfo: {
            type: Function,
        },
        getOpenID: {
            type: Function,
        },
    },

    data: {
        chats: [],
        textInputValue: '',
        openId: '',
        scrollTop: 0,
        scrollToMessage: '',
        hasKeyboard: false,
    },

    methods: {
        onGetUserInfo(e) {
            this.properties.onGetUserInfo(e)
        },

        getOpenID() {
            return this.properties.getOpenID()
        },

        mergeCommonCriteria(criteria) {
            return {
                groupId: this.data.groupId,
                ...criteria,
            }
        },

        async initRoom() {
            this.try(async () => {
                await this.initOpenID()

                const {
                    envId,
                    collection
                } = this.properties
                this.db = wx.cloud.database({
                    env: envId,
                })
                const db = this.db
                const _ = db.command

                const {
                    data: initList
                } = await db.collection(collection).where(this.mergeCommonCriteria()).orderBy('sendTimeTS', 'desc').get()

                console.log('init query chats', initList)

                this.setData({
                    chats: initList.reverse(),
                    scrollTop: 10000,
                })

                setTimeout(() => {
                    this.initWatch(initList.length ? {
                        sendTimeTS: _.gt(initList[initList.length - 1].sendTimeTS),
                    } : {})
                }, '初始化失败')
            }, 1000);
        },

        async initOpenID() {
            return this.try(async () => {
                const openId = await this.getOpenID()

                this.setData({
                    openId,
                })
            }, '初始化 openId 失败')
        },

        async initWatch(criteria) {
            this.try(() => {
                const {
                    collection
                } = this.properties
                const db = this.db
                const _ = db.command

                console.warn(`开始监听`, criteria)
                // 一定一定要设置延时：
                // close后需要隔一段时间才能重新watch，否则就会报错，我现在是通过设置等待时间解决的，但是需要等待的时间并不确定，设太大又影响体验，我现在是设置了半秒钟，如果这之后还发生错误就给用户报错，
                // 让他手动重新watch，
                setTimeout(() => {
                    this.messageListener = db.collection(collection).where(this.mergeCommonCriteria(criteria))
                        .watch({
                            onChange: this.onRealtimeMessageSnapshot.bind(this),
                            onError: e => {
                                if (!this.inited || this.fatalRebuildCount >= FATAL_REBUILD_TOLERANCE) {
                                   
                                        setTimeout(() => {
                                            this.initWatch(this.data.chats.length ? {
                                                sendTimeTS: _.gt(this.data.chats[this.data.chats.length - 1].sendTimeTS),
                                            } : {})
                                        }, 1000);
                                    
                                } else {
                                    setTimeout(() => {
                                        this.initWatch(this.data.chats.length ? {
                                        sendTimeTS: _.gt(this.data.chats[this.data.chats.length - 1].sendTimeTS),
                                    } : {})
                                    }, 1000);
                                }
                            },
                        })
                }, 1000)
            }, 1000);
        },

        onRealtimeMessageSnapshot(snapshot) {
            console.warn(`收到消息`, snapshot)

            if (snapshot.type === 'init') {
                this.setData({
                    chats: [
                        ...this.data.chats,
                        ...[...snapshot.docs].sort((x, y) => x.sendTimeTS - y.sendTimeTS),
                    ],
                })
                this.scrollToBottom()
                this.inited = true
            } else {
                let hasNewMessage = false
                let hasOthersMessage = false
                const chats = [...this.data.chats]
                for (const docChange of snapshot.docChanges) {
                    switch (docChange.queueType) {
                        case 'enqueue': {
                            hasOthersMessage = docChange.doc._openid !== this.data.openId
                            const ind = chats.findIndex(chat => chat._id === docChange.doc._id)
                            if (ind > -1) {
                                if (chats[ind].msgType === 'image' && chats[ind].tempFilePath) {
                                    chats.splice(ind, 1, {
                                        ...docChange.doc,
                                        tempFilePath: chats[ind].tempFilePath,
                                    })
                                } else chats.splice(ind, 1, docChange.doc)
                            } else {
                                hasNewMessage = true
                                chats.push(docChange.doc)
                            }
                            break
                        }
                    }
                }
                this.setData({
                    chats: chats.sort((x, y) => x.sendTimeTS - y.sendTimeTS),
                })
                if (hasOthersMessage || hasNewMessage) {
                    this.scrollToBottom()
                }
            }
        },
        // 提取的更新消息列表消息

        // 提取出来的addMsg
        addSysMsg(text, time, timeTs) {
            // 更新不成功，添加新消息
            this.db.collection('sys_msg')
                .add({
                    data: {
                        type: this.data.chatType,
                        groupId: this.data.groupId,
                        userIds: [this.data.userId, this.data.openId],
                        users: [this.data.userInfo, {
                            _openid: this.data.userId,
                            avatarUrl: this.data.userAvatar,
                            nickName: this.data.userNickName
                        }],
                        icon: this.data.userInfo.avatarUrl,
                        title: this.data.userInfo.nickName,
                        // 内容
                        content: text,
                        // 时间
                        time: time,
                        // 发送时间
                        sendTimeTS: timeTs, // fallback
                        unreadCount: 0
                    }
                })
                .then(res => {
                    console.log("添加消息到消息列表", res);
                })
        },
        async onConfirmSendText(e) {
            this.try(async () => {
                if (!e.detail.value) {
                    return
                }

                const {
                    collection
                } = this.properties

                const db = this.db
                const _ = db.command

                var time = new Date();
                var timeTs = Date.now();
                const doc = {
                    _id: `${Math.random()}_${timeTs}`,
                    groupId: this.data.groupId,
                    avatar: this.data.userInfo.avatarUrl,
                    nickName: this.data.userInfo.nickName,
                    msgType: 'text',
                    textContent: e.detail.value,
                    sendTime: time,
                    sendTimeTS: timeTs, // fallback
                }

                this.setData({
                    textInputValue: '',
                    chats: [
                        ...this.data.chats,
                        {
                            ...doc,
                            _openid: this.data.openId,
                            writeStatus: 'pending',
                        },
                    ],
                })
                this.scrollToBottom(true)
                // 插入消息，能查询到才更新
                await db.collection(collection).add({
                    data: doc,
                }).then(res => {
                    console.log("发送文本准备更新", res);
                    // 调用提取的更新消息列表消息
                    this.updateSysMsg(e.detail.value, time, timeTs);
                })

                this.setData({
                    chats: this.data.chats.map(chat => {
                        if (chat._id === doc._id) {
                            return {
                                ...chat,
                                writeStatus: 'written',
                            }
                        } else return chat
                    }),
                })
            }, '发送文字失败')
        },
        updateSysMsg(text, time, timeTs) {
            // 注意这里的this
            this.db.collection('sys_msg')
                .where({
                    type: this.data.chatType,
                    groupId: this.data.groupId,
                })
                .update({
                    data: {
                        // 需要传递过来的参数
                        content: text,
                        time: time,
                        sendTimeTS: timeTs, // fallback
                        childType: ''
                    }
                })
                .then(res => {
                    console.log("更新消息列表", res);
                    if (res.stats.updated == 1) {
                        // 如果更新成功说明消息已经存在
                        return;
                    } else {
                        // 提取的添加
                        this.addSysMsg(text, time, timeTs);
                    }
                })
        },
        async onChooseImage(e) {
            var time = new Date();
            var timeTs = Date.now()
            wx.chooseImage({
                count: 1,
                sourceType: ['album', 'camera'],
                success: async res => {
                    const {
                        envId,
                        collection
                    } = this.properties
                    const doc = {
                        // timeTs
                        _id: `${Math.random()}_${timeTs}`,
                        groupId: this.data.groupId,
                        avatar: this.data.userInfo.avatarUrl,
                        nickName: this.data.userInfo.nickName,
                        msgType: 'image',
                        sendTime: time,
                        sendTimeTS: timeTs, // fallback
                    }

                    this.setData({
                        chats: [
                            ...this.data.chats,
                            {
                                ...doc,
                                _openid: this.data.openId,
                                tempFilePath: res.tempFilePaths[0],
                                writeStatus: 0,
                            },
                        ]
                    })
                    this.scrollToBottom(true)

                    const uploadTask = wx.cloud.uploadFile({
                        cloudPath: `${this.data.openId}/${Math.random()}_${Date.now()}.${res.tempFilePaths[0].match(/\.(\w+)$/)[1]}`,
                        filePath: res.tempFilePaths[0],
                        config: {
                            env: envId,
                        },
                        success: res => {
                            this.try(async () => {
                                await this.db.collection(collection).add({
                                        data: {
                                            ...doc,
                                            imgFileID: res.fileID,
                                        },
                                    })
                                    .then(res => {
                                        this.updateSysMsg('[图片消息]', time, timeTs);
                                    })
                            }, '发送图片失败')
                        },
                        fail: e => {
                            this.showError('发送图片失败', e)
                        },
                    })

                    uploadTask.onProgressUpdate(({
                        progress
                    }) => {
                        this.setData({
                            chats: this.data.chats.map(chat => {
                                if (chat._id === doc._id) {
                                    return {
                                        ...chat,
                                        writeStatus: progress,
                                    }
                                } else return chat
                            })
                        })
                    })
                },
            })
        },

        onMessageImageTap(e) {
            wx.previewImage({
                urls: [e.target.dataset.fileid],
            })
        },

        scrollToBottom(force) {
            if (force) {
                console.log('force scroll to bottom')
                this.setData(SETDATA_SCROLL_TO_BOTTOM)
                return
            }

            this.createSelectorQuery().select('.body').boundingClientRect(bodyRect => {
                this.createSelectorQuery().select(`.body`).scrollOffset(scroll => {
                    if (scroll.scrollTop + bodyRect.height * 3 > scroll.scrollHeight) {
                        console.log('should scroll to bottom')
                        this.setData(SETDATA_SCROLL_TO_BOTTOM)
                    }
                }).exec()
            }).exec()
        },

        async onScrollToUpper() {
            if (this.db && this.data.chats.length) {
                const {
                    collection
                } = this.properties
                const _ = this.db.command
                const {
                    data
                } = await this.db.collection(collection).where(this.mergeCommonCriteria({
                    sendTimeTS: _.lt(this.data.chats[0].sendTimeTS),
                })).orderBy('sendTimeTS', 'desc').get()
                this.data.chats.unshift(...data.reverse())
                this.setData({
                    chats: this.data.chats,
                    scrollToMessage: `item-${data.length}`,
                    scrollWithAnimation: false,
                })
            }
        },

        async try (fn, title) {
            try {
                await fn()
            } catch (e) {
                this.showError(title, e)
            }
        },

        showError(title, content, confirmText, confirmCallback) {
            // console.error(title, content)
            wx.showModal({
                title,
                content: content.toString(),
                showCancel: confirmText ? true : false,
                confirmText,
                success: res => {
                    res.confirm && confirmCallback()
                },
            })
        },
    },

    ready() {
        global.chatroom = this
        this.initRoom()
        this.fatalRebuildCount = 0
    },
})