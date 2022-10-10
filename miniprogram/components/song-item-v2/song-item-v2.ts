// components/song-item-v2/song-item-v2.ts
import userInfoStore, { ISongMenuRecord } from "../../stores/userInfoStore"

Component({
  properties: {
    type: {
      type: Number,
      value: -1,
    },
    mySongMenu_id: {
      type: String,
      value: "",
    },
    order: {
      type: Number,
      value: 0,
    },
    stripe: {
      type: Boolean,
      value: true,
    },
    itemData: {
      type: Object,
      value: {},
    },
  },

  data: {
    isLove: false,
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
    },
  },

  methods: {
    onSongItemTap() {
      const id = this.properties.itemData.id
      wx.navigateTo({
        url: `/packagePlayer/pages/music-player/music-player?id=${id}`,
      })
    },

    async onControlTap() {
      const type = this.properties.type
      const itemList =
        type === 3 ? ["添加到歌单"] : ["添加到歌单", "移除出歌单"]

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
      if (!handleRes) return

      const msg = handleRes.errMsg.split(":").pop()
      if (msg === "ok") {
        wx.showToast({ title: `操作成功~` })
      } else {
        wx.showToast({ title: `操作失败~`, icon: "error" })
      }
    },

    async handleLoveRecord() {
      const currentSong = this.data.itemData
      const isLove = this.data.isLove
      let handleRes = null

      // 删除/添加 喜欢
      if (isLove) {
        handleRes = await userInfoStore.deleteLoveSong(currentSong.id)
        this.setData({ isLove: false })
      } else {
        handleRes = await userInfoStore.addLoveSong(currentSong)
        this.setData({ isLove: true })
      }

      return handleRes
    },

    async handleAddMySongMenu() {
      // 1.获取创建的歌单
      const songMenuNames = userInfoStore.mySongMenu.map(
        (item: ISongMenuRecord) => item.name
      )

      // 2.获取用户点击的结果
      let res = null
      try {
        res = await wx.showActionSheet({ itemList: songMenuNames })
      } catch (error) {
        console.log(error)
      }

      const tapIndex = res?.tapIndex

      if (tapIndex === undefined) return false

      // 3.更新
      const song = this.data.itemData
      const addRes = userInfoStore.addSongToMenu(tapIndex, song)

      return addRes
    },

    async handleDeleteMySongMenu() {
      const menuId = this.properties.mySongMenu_id
      const songId = this.data.itemData.id

      const res = await userInfoStore.deleteSongToMenu(menuId, songId)

      return res
    },
  },
})
