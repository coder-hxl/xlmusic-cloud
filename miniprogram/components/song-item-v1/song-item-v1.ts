// components/song-item-v1/song-item-v1.ts
Component({
  properties: {
    songData: {
      type: Object,
      value: {}
    }
  },
  methods: {
    onSongItemTap() {
      const id = this.properties.songData.id
      wx.navigateTo({
        url: `/packagePlayer/pages/music-player/music-player?id=${id}`
      })
    }
  }
})
