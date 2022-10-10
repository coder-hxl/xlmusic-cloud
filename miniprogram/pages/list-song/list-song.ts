import newStore from '../../stores/newStore'
import playerStore from '../../stores/playerStore'
import userInfoStore, { IHistory } from '../../stores/userInfoStore'

Page({
  data: {
    title: '',
    songList: [] as any[]
  },

  onLoad(options: any) {
    const { listType, title } = options
    this.setData({ title })

    if (listType == 1) {
      const songList = userInfoStore.history.tracks
      this.setData({ songList })
      userInfoStore.watch('history', this.handleHistoryChange)
    } else if (listType == 2) {
      newStore.fetchNewSongsActions(100)
      newStore.watch('newSongs', this.handleNewSongs)
    }
  },

  onUnload() {
    newStore.deleteWatch('songList', this.handleNewSongs)
  },

  onSongItemTap(event: any) {
    const index = event.currentTarget.dataset.index
    playerStore.playSongIndex = index
    playerStore.playSongList = this.data.songList
  },

  // ================== Store ==================
  handleNewSongs(stateKey: string, value: any) {
    this.setData({ songList: value })
  },

  handleHistoryChange(key: string, value: IHistory) {
    const songList = value.tracks
    this.setData({ songList })
  }
})
