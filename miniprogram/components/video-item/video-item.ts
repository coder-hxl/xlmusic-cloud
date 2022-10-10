// components/video-item/video-item.ts
Component({
  properties: {
    videoData: {
      type: Object,
      value: {}
    }
  },

  externalClasses: ['e-video-item', 'e-album', 'e-content'],

  methods: {
    onVideoItemTap() {
      // 1.获取 video 的 id
      const id = this.properties.videoData.id

      // 2.跳转到 detail-video 页面并把 id 传过去
      wx.navigateTo({
        url: `/packageVideo/pages/detail-video/detail-video?id=${id}`
      })
    }
  }
})
