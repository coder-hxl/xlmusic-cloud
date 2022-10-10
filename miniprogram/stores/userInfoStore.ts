import xlStore from "xl-store"
import { cmd, loveCol, mySongMenuCol, historyCol } from "../database/index"
import { verifyLogin } from "../utils/verify"

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
    const userInfo = wx.getStorageSync("userInfo") as WechatMiniprogram.UserInfo

    const res: ISongMenuRecord = {
      name,
      description,
      coverImgUrl: null,
      creator: {
        nickname: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
      },
      subscribedCount: 0,
      shareCount: 0,
      tracks: [],
    }

    return res
  },
  history() {
    const data: IHistory = {
      tracks: [],
    }
    return data
  },
}

const userInfoStore = xlStore({
  state: {
    userInfo: {} as WechatMiniprogram.UserInfo,
    loveRecord: {},
    mySongMenu: [],
    history: {},
  },

  actions: {
    async loginActions() {
      // 1.获取用户信息
      let res: WechatMiniprogram.GetUserProfileSuccessCallbackResult | null = null
      try {
        res = await wx.getUserProfile({ desc: "获取您的头像和名称" })
      } catch (error) {
        wx.showToast({ title: "登录失败~", icon: "error" })
        return {
          state: false,
        }
      }

      // 2.保存数据
      const userInfo = res.userInfo
      wx.setStorageSync("userInfo", userInfo)
      await this.initStoreDataAction()

      return {
        state: true,
        data: userInfo,
      }
    },

    async createLoveRecordAction() {
      // 1.判断是否创建过
      const res = await loveCol.get({}, null, false)

      if (res.data.length) return true

      // 2.生成初始数据
      const loveRecord = initData.songRecord("我的喜欢")
      loveRecord.coverImgUrl = "/assets/images/icons/love-activate.png"

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
      mySongMenuRecord.coverImgUrl = "/assets/images/icons/music-box.png"

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
      const userInfo = wx.getStorageSync("userInfo")
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
      console.log("getLoveRecordAction", res.data)
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
      console.log("getMySongMenuAction", mySongMenus)

      return (this.mySongMenu = mySongMenus)
    },

    async getHistoryAction() {
      const res = await historyCol.get({}, null, false)
      const data = res.data[0]
      data.tracks = data.tracks.reverse()

      console.log("getHistoryAction", data)

      return (this.history = data)
    },

    async addLoveSong(currentSong: any) {
      // 1.添加歌曲
      const addRes = await loveCol.update(
        {},
        { tracks: cmd.push(currentSong) },
        false
      )

      // 2.更新封面图片
      const coverImgUrl = currentSong.al?.picUrl ?? currentSong.picUrl
      await loveCol.update({}, { coverImgUrl }, false)

      // 3.获取最新数据
      userInfoStore.getLoveRecordAction()

      return addRes
    },

    async addSongToMenu(menuIndex: number, song: any) {
      // 1.获取选择的歌单
      const addSongMenu = this.mySongMenu[menuIndex]
      const isHasSong = !!addSongMenu.tracks.filter(
        (item: any) => item.id === song.id
      ).length

      if (isHasSong) {
        wx.showToast({ title: "已有该歌曲~", icon: "error" })
        return false
      }

      // 2.添加歌曲
      const addRes = await mySongMenuCol.update(
        { _id: addSongMenu._id },
        { tracks: cmd.push(song) },
        false
      )

      // 3.更新封面图片
      const coverImgUrl = song.al?.picUrl ?? song.picUrl

      await mySongMenuCol.update(
        { _id: addSongMenu._id },
        { coverImgUrl },
        false
      )

      // 4.获取最新数据
      userInfoStore.getMySongMenuAction()

      return addRes
    },

    async addHistoryAction(song: any) {
      await historyCol.update({}, { tracks: cmd.push(song) }, false)

      this.getHistoryAction()
    },

    async deleteLoveSong(songId: number) {
      // 1.获取追踪的歌曲, 选出要保留的
      const newTracks: any[] = this.loveRecord.tracks
        .filter((item: any) => item.id !== songId)
        .reverse()

      // 2.更新到追踪
      const deleteRes = await loveCol.update({}, { tracks: newTracks }, false)

      // 3.更新封面图片
      const newCoverData = [...newTracks].pop()
      const coverImgUrl = newTracks.length
        ? newCoverData.al?.picUrl ?? newCoverData.picUrl
        : "/assets/images/icons/love-activate.png"
      await loveCol.update({}, { coverImgUrl }, false)

      // 4.获取最新数据
      userInfoStore.getLoveRecordAction()

      return deleteRes
    },

    async deleteSongToMenu(menuId: string, songId: number) {
      // 1.获取对应歌单
      const currentSongMenu: ISongMenuRecord = userInfoStore.mySongMenu.filter(
        (item: ISongMenuRecord) => item._id === menuId
      )[0]

      // 2.获取剩余歌曲
      const tracks = currentSongMenu.tracks
        .filter((item) => item.id !== songId)
        .reverse()

      // 3.更新
      // 3.1. 更新歌单
      const deleteRes = await mySongMenuCol.update(
        { _id: menuId },
        { tracks },
        false
      )

      // 3.2. 更新封面图片
      const newCoverData = [...tracks].pop()
      const coverImgUrl = tracks.length
        ? newCoverData.al?.picUrl ?? newCoverData.picUrl
        : "/assets/images/icons/music-box.png"
      await mySongMenuCol.update({ _id: menuId }, { coverImgUrl }, false)

      // 4.获取最新数据
      userInfoStore.getMySongMenuAction()

      return deleteRes
    },
  },
})

verifyLogin() && userInfoStore.initStoreDataAction()

export default userInfoStore
