import songlistStore from '../../stores/songListStore'
import playerStore from '../../stores/playerStore'
import userInfoStore from '../../stores/userInfoStore'
import { IHistory } from '../../stores/userInfoTypes'

Page({
  data: {
    title: '',
    songList: [] as any[]
  },

  onLoad(options: any) {
    const { listType, title } = options
    this.setData({ title })

    if (listType == 1) {
      userInfoStore.watchEffect('history', this.handleHistoryChange)
    } else if (listType == 2) {
      songlistStore.fetchNewSongsActions(100)
      songlistStore.watchEffect('newSongs', this.handleNewSongs)
    } else if (listType == 3) {
      songlistStore.fetchSearchSong(title)
      songlistStore.watchEffect('searchSongs', this.handleSrarchSongs)
    }
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
  },

  handleSrarchSongs(key: string, value: any) {
    this.setData({ songList: value })
  },

  onUnload() {
    userInfoStore.deleteWatch('history', this.handleHistoryChange)
    songlistStore.deleteWatch('songList', this.handleNewSongs)
    songlistStore.deleteWatch('searchSongs', this.handleSrarchSongs)
  }
})
