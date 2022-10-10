import topListStore from '../../stores/topListStore'

Page({
  data: {
    officialList: [] as any[],
    globalList: [] as any[]
  },

  onLoad() {
    this.initData()
  },

  initData() {
    const officialList: any[] = topListStore.officialList
    const globalList: any[] = topListStore.globalList
    this.setData({ officialList, globalList })
  },

  onGloablItemTap(event: any) {
    const id = event.currentTarget.dataset.id
    const type = 3
    wx.navigateTo({
      url: `/pages/detail-song-menu/detail-song-menu?type=${type}&id=${id}`
    })
  },

  onUnload() {}
})
