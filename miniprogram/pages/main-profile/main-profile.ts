// pages/main-profile/main-profile.ts
import { debounce } from 'underscore'
import userInfoStore from '../../stores/userInfoStore'
import { ISongMenuRecord } from '../../stores/userInfoTypes'

import { verifyLogin } from '../../utils/verify'

import { ICreateSongMenuArg } from '../../stores/userInfoTypes'

Page({
  data: {
    userInfo: {} as WechatMiniprogram.UserInfo,
    myMusicList: [
      { name: '我的喜欢', nickName: 'love', icon: 'love-activate' },
      { name: '历史记录', nickName: 'history', icon: 'history' }
    ],

    createSongMenuData: {
      name: '',
      description: ''
    } as ICreateSongMenuArg,

    dialogData: [] as any[],

    mySongMenu: [],

    isLogin: false,
    isShowDialog: false
  },

  onLoad() {
    this.initDialogData()

    // 观察数据
    userInfoStore.watchEffect('isLogin', this.fetchUserInfo)
    userInfoStore.watchEffect('mySongMenu', this.fetchMySongMenu)
  },

  initDialogData() {
    this.setData({
      dialogData: [
        {
          name: '歌单名',
          modelKey: 'name',
          placeholder: '输入歌单名'
        },
        {
          name: '描述',
          modelKey: 'description',
          placeholder: '输入描述'
        }
      ]
    })
  },

  // ============== 事件处理 ==============
  async onUserInfoTap() {
    const isLogin = verifyLogin()
    if (isLogin) {
      console.log('您已登录~')
    } else {
      this.handleLogin()
    }
  },

  async handleLogin() {
    const res = await userInfoStore.loginActions()
    if (!res.state) {
      wx.showToast({ title: '登录失败~', icon: 'error' })
      return false
    }

    const userInfo = res.data
    this.setData({ isLogin: true, userInfo })
    return true
  },

  async onMyMusicItemTap(event: any) {
    // 1.登录, 必须登录才能使用
    const isLogin = verifyLogin()
    const loginRes = !isLogin ? await this.handleLogin() : true
    if (!loginRes) return

    // 2.跳转页面
    const { nickName } = event.currentTarget.dataset.item
    if (nickName === 'love') {
      const type = 1
      wx.navigateTo({
        url: `/pages/detail-song-menu/detail-song-menu?type=${type}`
      })
    } else if (nickName === 'history') {
      const listType = 1
      wx.navigateTo({
        url: `/pages/list-song/list-song?listType=${listType}&title=历史记录`
      })
    }
  },

  async onCreateSongMenuTap() {
    // 1.登录, 必须登录才能使用
    const isLogin = verifyLogin()
    const loginRes = !isLogin ? await this.handleLogin() : true
    if (!loginRes) return

    // 2.展示框
    this.setData({ isShowDialog: true })
  },

  onDialogConfirmTap() {
    const data = this.data.createSongMenuData

    userInfoStore.createMySongMenuRecordAction(data)
  },

  onDialogCloseTap() {
    // 关闭弹出框时清除输入框的内容
    this.setData({
      createSongMenuData: {
        name: '',
        description: ''
      }
    })
  },

  onMySongMenuItemTap(event: any) {
    const mySongMenuIndex: number = event.currentTarget.dataset.index
    const type = 2
    wx.navigateTo({
      url: `/pages/detail-song-menu/detail-song-menu?type=${type}&mySongMenuIndex=${mySongMenuIndex}`
    })
  },

  async onDeleteSongMenu(event: any) {
    // 1.获取_id
    const item: ISongMenuRecord = event.currentTarget.dataset.item
    const { _id } = item

    // 2.通过云函数删除
    const res = await wx.cloud.callFunction({
      name: 'deleteData',
      data: { colName: 'c_my_song_menu', whereData: { _id }, _id }
    })

    // 3.判断结果
    const resMsg = res.errMsg.split(':').pop()
    if (resMsg == 'ok') {
      wx.showToast({ title: '删除成功~' })
      userInfoStore.getMySongMenuAction()
    } else {
      wx.showToast({ title: '删除失败~', icon: 'error' })
    }
  },

  onCreateSongMenuIptTap: debounce(function (this: any, event: any) {
    const { modelkey } = event.currentTarget.dataset
    const value = event.detail.value

    const rawData = this.data.createSongMenuData
    const newData = { ...rawData, [modelkey]: value }

    this.setData({ createSongMenuData: newData })
  }, 300),

  // ============== store 处理 ==============
  fetchUserInfo(key: string, isLogin: boolean) {
    if (isLogin) {
      const userInfo: WechatMiniprogram.UserInfo = userInfoStore.userInfo
      this.setData({ isLogin, userInfo })
    } else {
      this.setData({ isLogin })
    }
  },

  fetchMySongMenu(key: string, mySongMenu: any) {
    this.setData({ mySongMenu })
  },

  onUnload() {
    userInfoStore.deleteWatch('isLogin', this.fetchUserInfo)
    userInfoStore.deleteWatch('mySongMenu', this.fetchMySongMenu)
  }
})
