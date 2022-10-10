import xlStore from 'xl-store'
import { cmd, loveCol, mySongMenuCol, historyCol } from '../database/index'
import { verifyLogin } from '../utils/verify'

export interface ISongMenuRecord {
  _id?: string
  _openid?: string
  name: string
  description: null | string
  coverImgUrl: null | string
  creator: {
    nickname: string
    avatarUrl: string
  }
  subscribedCount: number
  shareCount: number
  tracks: any[]
}

export interface IHistory {
  _id?: string
  _openid?: string
  tracks: any[]
}

const initData = {
  songRecord(name: string, description: string | null = null): ISongMenuRecord {
    const userInfo = wx.getStorageSync('userInfo') as WechatMiniprogram.UserInfo

    const res: ISongMenuRecord = {
      name,
      description,
      coverImgUrl: null,
      creator: {
        nickname: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl
      },
      subscribedCount: 0,
      shareCount: 0,
      tracks: []
    }

    return res
  },
  history() {
    const data: IHistory = {
      tracks: []
    }
    return data
  }
}

const userInfoStore = xlStore({
  state: {
    userInfo: {} as WechatMiniprogram.UserInfo,
    loveRecord: {},
    mySongMenu: [],
    history: {}
  },

  actions: {
    async loginActions() {
      // 1.获取用户信息
      let res: WechatMiniprogram.GetUserProfileSuccessCallbackResult | null = null
      try {
        res = await wx.getUserProfile({ desc: '获取您的头像和名称' })
      } catch (error) {
        wx.showToast({ title: '登录失败~', icon: 'error' })
        return {
          state: false
        }
      }

      // 2.保存数据
      const userInfo = res.userInfo
      wx.setStorageSync('userInfo', userInfo)
      await this.initStoreDataAction()

      return {
        state: true,
        data: userInfo
      }
    },

    async createLoveRecordAction() {
      // 1.判断是否创建过
      const res = await loveCol.get({}, null, false)

      if (res.data.length) return true

      // 2.生成初始数据
      const loveRecord = initData.songRecord('我的喜欢')
      loveRecord.coverImgUrl = '/assets/images/icons/love-activate.png'

      // 3.添加到云数据库
      const addRes = await loveCol.add(loveRecord)
      this.loveRecord = { ...loveRecord, _id: addRes._id }
      return true
    },

    async createMySongMenuRecordAction(
      songMenuName: string,
      songMenuDes: string
    ) {
      const res = await mySongMenuCol.get({ name: songMenuName }, null, false)

      if (res.data.length) return

      const mySongMenuRecord = initData.songRecord(songMenuName, songMenuDes)
      mySongMenuRecord.coverImgUrl = '/assets/images/icons/music-box.png'

      const addRes = await mySongMenuCol.add(mySongMenuRecord)
      this.mySongMenu.push({ ...mySongMenuRecord, _id: addRes._id })
    },

    async createHistoryRecordAction() {
      const res = await historyCol.get({}, null, false)

      if (res.data.length) return

      const historyRecord = initData.history()
      const addRes = await historyCol.add(historyRecord)
      this.history = { ...historyRecord, _id: addRes._id }
    },

    initStoreDataAction() {
      const userInfo = wx.getStorageSync('userInfo')
      this.userInfo = userInfo

      this.createLoveRecordAction().then(() => {
        this.getLoveRecordAction()
      })

      this.getMySongMenuAction()

      this.createHistoryRecordAction().then(() => {
        this.getHistoryAction()
      })
    },

    async getLoveRecordAction() {
      const res = await loveCol.get({}, null, false)
      console.log('getLoveRecordAction', res.data)
      const loveRecord = res.data[0] as ISongMenuRecord
      loveRecord.tracks = loveRecord.tracks.reverse()
      return (this.loveRecord = loveRecord)
    },

    async getMySongMenuAction() {
      const res = await mySongMenuCol.get({}, null, false)
      const mySongMenus = res.data as ISongMenuRecord[]
      for (const item of mySongMenus) {
        item.tracks.reverse()
      }
      console.log('getMySongMenuAction', mySongMenus)

      return (this.mySongMenu = mySongMenus)
    },

    async getHistoryAction() {
      const res = await historyCol.get({}, null, false)
      const data = res.data[0]
      data.tracks = data.tracks.reverse()

      console.log('getHistoryAction', data)

      return (this.history = data)
    },

    async addHistoryAction(song: any) {
      await historyCol.update({}, { tracks: cmd.push(song) }, false)

      this.getHistoryAction()
    }
  }
})

verifyLogin() && userInfoStore.initStoreDataAction()

export default userInfoStore
