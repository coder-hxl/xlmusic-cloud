import { getDetailSongMenu } from '../../services/music'
import playerStore from '../../stores/playerStore'
import userInfoStore from '../../stores/userInfoStore'

Page({
  data: {
    type: null as number | null,
    detailData: {} as any,
    mySongMenuIndex: null as number | null
  },

  async onLoad(options: any) {
    const { type, id, mySongMenuIndex } = options
    const typeNum = parseInt(type)
    this.setData({ type: typeNum })

    if (typeNum === 1) {
      const detailData = userInfoStore.loveRecord
      this.setData({ detailData })
      userInfoStore.watch('loveRecord', this.handleLoveStore)
    } else if (typeNum === 2) {
      const detailData = userInfoStore.mySongMenu[mySongMenuIndex]
      this.setData({ detailData, mySongMenuIndex })
      userInfoStore.watch('mySongMenu', this.handleMySongMenuStore)
    } else if (typeNum === 3) {
      this.fetchDetailSongMenu(id)
    }
  },

  async fetchDetailSongMenu(id: number) {
    const res = await getDetailSongMenu(id)
    this.setData({ detailData: res.playlist })
  },

  onSongItemTap(event: any) {
    const index = event.currentTarget.dataset.index
    playerStore.playSongIndex = index

    playerStore.playSongList = this.data.detailData.tracks
  },

  // ================ store ================
  handleLoveStore(key: string, value: any) {
    this.setData({ detailData: value })
  },

  handleMySongMenuStore(key: string, value: any[]) {
    const index = this.data.mySongMenuIndex
    if (!index) return

    const detailData = value[index]
    this.setData({ detailData })
  },

  onUnload() {
    userInfoStore.deleteWatch('loveRecord', this.handleLoveStore)

    userInfoStore.deleteWatch('mySongMenu', this.handleMySongMenuStore)
  }
})
