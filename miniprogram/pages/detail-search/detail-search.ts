// pages/detail-search/detail-search.ts
import { debounce } from 'underscore'

import { getSearchSuggestKey } from '../../services/music'
import playerStore from '../../stores/playerStore'

Page({
  data: {
    suggestSongs: []
  },

  // ==================== 事件 ====================
  onInputChange: debounce(async function (this: any, event: any) {
    const value = event.detail
    console.log('onInputChangeValue', value)

    // 获取推荐歌
    const res = await getSearchSuggestKey(value)
    console.log(res)
    const suggestSongs = res.code === 200 ? res.result.songs : []
    this.setData({ suggestSongs })
  }, 300),

  onSuggestItemTap(event: any) {
    // 播放音乐
    const { item } = event.currentTarget.dataset
    playerStore.playSongList = [item]
    wx.navigateTo({
      url: `/packagePlayer/pages/music-player/music-player?id=${item.id}`
    })
  }
})
