// components/song-item-v2/song-item-v2.ts
import userInfoStore from '../../stores/userInfoStore'
import { ISongMenuRecord, IAddOrDeleteRes } from '../../stores/userInfoTypes'

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
    isLove: false,
    fetchIsLoveFn: null as null | Function
  },

  lifetimes: {
    ready() {
      // 添加追踪
      const fetchIsLove = (this.data.fetchIsLoveFn = this.fetchIsLove.bind(
        this
      ))
      userInfoStore.watchEffect('isLogin', fetchIsLove)
    },

    detached() {
      // 删除追踪
      const fetchIsLove = this.data.fetchIsLoveFn as Function
      userInfoStore.deleteWatch('isLogin', fetchIsLove)
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
      // 0.验证是否登陆
      const isLogin = userInfoStore.isLogin
      if (!isLogin) {
        const res = await userInfoStore.loginAction()
        if (!res.state) return
      }

      // 1.根据类型提供选项
      const type = this.properties.type
      const itemList =
        type === 3 ? ['添加到歌单'] : ['添加到歌单', '移除出歌单']

      // 2.获取用户点击的选项
      let res = null
      try {
        res = await wx.showActionSheet({ itemList })
      } catch (error) {
        return
      }

      // 3.根据结果做出对应处理
      const tapIndex = res?.tapIndex
      let handleRes: boolean | IAddOrDeleteRes = false
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
      if (!handleRes || !handleRes.showDialog) return

      if (handleRes.res) {
        wx.showToast({ title: handleRes.successMsg || '成功' })
      } else {
        wx.showToast({ title: handleRes.failMsg || '失败', icon: 'error' })
      }
    },

    async handleLoveRecord() {
      // 1.查看是否被收藏
      const currentSong = this.data.itemData
      const isLove = this.data.isLove
      let handleRes: IAddOrDeleteRes | boolean = false

      // 2.删除/添加 喜欢
      if (isLove) {
        handleRes = await userInfoStore.deleteLoveSongAction(currentSong.id)
        this.setData({ isLove: !handleRes.res })
      } else {
        handleRes = await userInfoStore.addLoveSongAction(currentSong)
        this.setData({ isLove: handleRes.res })
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
        return false
      }

      // 3.更新
      const tapIndex = res?.tapIndex
      const song = this.data.itemData
      const addRes = await userInfoStore.addSongToMenuAction(tapIndex, song)

      return addRes
    },

    async handleDeleteMySongMenu() {
      const menuId = this.properties.mySongMenu_id
      const songId = this.data.itemData.id

      const res = await userInfoStore.deleteSongToMenuAction(menuId, songId)

      return res
    },

    // ============= store =============
    fetchIsLove(key: string, isLogin: boolean) {
      // 必须登录才能获取
      if (!isLogin) return

      const itemData = this.properties.itemData
      const isLove = userInfoStore.loveRecord.tracks
        .map((item: any) => item.id)
        .includes(itemData.id)

      this.setData({ isLove })
    }
  }
})
