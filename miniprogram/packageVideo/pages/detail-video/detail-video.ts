import { getMVDetail, getMVUrl, getSimiMV } from '../../../services/video'

// pages/detail-video/detail-video.ts
Page({
  data: {
    id: 0,
    MVUrl: '',
    detail: {},
    simiMV: []
  },

  onLoad(options: any) {
    // 1.获取数据
    const id = Number(options.id)

    // 2.设置 id
    this.setData({ id })

    // 3.根据 id 发送请求
    this.fetchMVUrl(id)
    this.fetchMVDetail(id)
    this.fetchRelatedMV(id)
  },

  async fetchMVUrl(id: number) {
    const res = await getMVUrl(id)
    this.setData({ MVUrl: res.data.url })
  },

  async fetchMVDetail(id: number) {
    const res = await getMVDetail(id)
    this.setData({ detail: res.data })
  },

  async fetchRelatedMV(id: number) {
    const res = await getSimiMV(id)
    this.setData({ simiMV: res.mvs })
  }
})
