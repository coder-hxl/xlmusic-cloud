// components/song-item-v2/song-item-v2.ts
import userInfoStore, { ISongMenuRecord } from '../../stores/userInfoStore'

const db = wx.cloud.database()
const cmd = db.command
const cLove: any = db.collection('c_love')
const cMySongMenu: any = db.collection('c_my_song_menu')

Component({
  properties: {
    type: {
      type: Number,
      value: -1
    },
    mySongMenu_id: {
      type: String,
      value: ''
    },
    order: {
      type: Number,
      value: 0
    },
    stripe: {
      type: Boolean,
      value: true
    },
    itemData: {
      type: Object,
      value: {}
    }
  },

  data: {
    isLove: false
  },

  lifetimes: {
    attached() {
      const itemData = this.data.itemData
      const loveRecord = userInfoStore.loveRecord

      // 没登录就获取不到
      if (!Object.keys(loveRecord).length) return

      const isLove = loveRecord.tracks
        .map((item: any) => item.id)
        .includes(itemData.id)

      this.setData({ isLove })
    }
  },

  methods: {
    onSongItemTap() {
      const id = this.properties.itemData.id
      wx.navigateTo({
        url: `/packagePlayer/pages/music-player/music-player?id=${id}`
      })
    },

    async onControlTap() {
      const type = this.properties.type
      const itemList =
        type === 3 ? ['添加到歌单'] : ['添加到歌单', '移除出歌单']

      // 2.获取用户点击的结果
      let res = null
      try {
        res = await wx.showActionSheet({ itemList })
      } catch (error) {
        console.log(error)
      }

      // 3.根据结果做出对应处理
      const tapIndex = res?.tapIndex
      if (tapIndex === undefined) return

      let handleRes = null

      switch (tapIndex) {
        // 添加到歌单
        case 0:
          handleRes = await this.handleAddMySongMenu()

          break

        // 移除出歌曲
        case 1:
          if (type === 1) {
            handleRes = await this.handleLoveRecord()
          } else if (type === 2) {
            handleRes = await this.handleDeleteMySongMenu()
          }

          break
      }

      // 4.验证结果
      const msg = handleRes.errMsg.split(':').pop()

      if (msg === 'ok') {
        wx.showToast({ title: `操作成功~` })
      } else {
        wx.showToast({ title: `操作失败~`, icon: 'error' })
      }
    },

    async handleLoveRecord() {
      const currentSong = this.data.itemData
      const isLove = this.data.isLove
      let handleRes = null

      // 删除/添加 喜欢
      if (isLove) {
        // 1.获取追踪的歌曲, 选出要保留的
        const loveRecord = userInfoStore.loveRecord
        const newTracks: any[] = loveRecord.tracks
          .filter((item: any) => item.id !== currentSong.id)
          .reverse()

        // 2.更新到追踪
        handleRes = await cLove
          .where({})
          .update({ data: { tracks: newTracks } })

        // 3.更新封面图片
        const newCoverData = [...newTracks].pop()
        const coverImgUrl = newTracks.length
          ? newCoverData.al?.picUrl ?? newCoverData.picUrl
          : '/assets/images/icons/love-activate.png'
        await cLove.where({}).update({ data: { coverImgUrl } })

        this.setData({ isLove: false })
      } else {
        // 1.添加歌曲
        handleRes = await cLove.where({}).update({
          data: { tracks: cmd.push(currentSong) }
        })

        // 2.更新封面图片
        const coverImgUrl = currentSong.al?.picUrl ?? currentSong.picUrl
        await cLove.where({}).update({ data: { coverImgUrl } })

        this.setData({ isLove: true })
      }

      // 获取最新数据
      userInfoStore.getLoveRecordAction()

      return handleRes
    },

    async handleAddMySongMenu() {
      // 1.获取创建的歌单
      const mySongMenu: ISongMenuRecord[] = userInfoStore.mySongMenu
      const itemList = mySongMenu.map((item: ISongMenuRecord) => item.name)

      // 2.获取用户点击的结果
      let res = null
      try {
        res = await wx.showActionSheet({ itemList })
      } catch (error) {
        console.log(error)
      }

      const tapIndex = res?.tapIndex

      if (tapIndex === undefined) return

      // 3.更新
      // 3.1. 判断歌曲是否存在于歌单
      const currentSong = this.data.itemData
      const addSongMenu = mySongMenu[tapIndex]
      const isHasSong = !!addSongMenu.tracks.filter(
        (item) => item.id === currentSong.id
      ).length

      if (isHasSong) {
        wx.showToast({ title: '已有该歌曲~', icon: 'error' })
        return
      }

      // 3.2. 添加歌曲
      const addRes = await cMySongMenu.where({ _id: addSongMenu._id }).update({
        data: {
          tracks: cmd.push(this.data.itemData)
        }
      })

      // 3.3. 更新封面图片
      const coverImgUrl = currentSong.al?.picUrl ?? currentSong.picUrl

      await cMySongMenu
        .where({ _id: addSongMenu._id })
        .update({ data: { coverImgUrl } })

      // 3.4. 获取最新数据
      userInfoStore.getMySongMenuAction()

      return addRes
    },

    async handleDeleteMySongMenu() {
      // 1.获取对应歌单
      const mySongMenu_id = this.properties.mySongMenu_id
      const itemData = this.data.itemData
      const currentSongMenu: ISongMenuRecord = userInfoStore.mySongMenu.filter(
        (item: ISongMenuRecord) => item._id === mySongMenu_id
      )[0]

      // 2.获取剩余歌曲
      const tracks = currentSongMenu.tracks
        .filter((item) => item.id !== itemData.id)
        .reverse()

      // 3.更新
      // 3.1. 更新歌单
      const res = await cMySongMenu
        .where({ _id: mySongMenu_id })
        .update({ data: { tracks } })

      // 3.2. 更新封面图片
      const newCoverData = [...tracks].pop()
      const coverImgUrl = tracks.length
        ? newCoverData.al?.picUrl ?? newCoverData.picUrl
        : '/assets/images/icons/music-box.png'
      await cMySongMenu
        .where({ _id: mySongMenu_id })
        .update({ data: { coverImgUrl } })

      userInfoStore.getMySongMenuAction()

      return res
    }
  }
})
