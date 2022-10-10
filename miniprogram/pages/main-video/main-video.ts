import { getTopMV } from '../../services/video'

// pages/main-video/main-video.ts
Page({
  data: {
    topMV: [] as any[],
    mapTopMV: [] as any[],
    offset: 0,
    hasMore: true
  },

  onLoad() {
    this.fetchTopMV()
  },

  async fetchTopMV() {
    // 1.获取数据
    const res = await getTopMV(this.data.offset)
    const newMapTopMVList = res.data.map((item: any) => {
      return {
        id: item.id,
        cover: item.cover,
        playCount: item.playCount,
        duration: item.mv.videos[0].duration,
        name: item.name,
        artistName: item.artistName
      }
    })

    // 2.合并数据
    const newTopMV = [...this.data.topMV, ...res.data]
    const mapTopMV = [...this.data.mapTopMV, ...newMapTopMVList]

    // 3.设置新数据
    this.setData({ mapTopMV })
    this.data.topMV = newTopMV
    this.data.offset = this.data.topMV.length
    this.data.hasMore = res.hasMore
  },

  onReachBottom() {
    // 1.判断是否还有数据
    if (!this.data.hasMore) return

    // 2.获取数据
    this.fetchTopMV()
  },

  async onPullDownRefresh() {
    // 1.初始化数据
    this.data.mapTopMV = []
    this.data.topMV = []
    this.data.offset = 0
    this.data.hasMore = true

    // 2.获取数据
    await this.fetchTopMV()

    // 3.停止下拉刷新
    wx.stopPullDownRefresh()
  }
})
