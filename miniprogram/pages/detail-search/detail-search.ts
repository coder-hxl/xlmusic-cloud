// pages/detail-search/detail-search.ts
import { debounce } from 'underscore'

import { getSearchSuggestKey } from '../../services/music'

Page({
  data: {
    suggestSongs: []
  },

  // ==================== 事件 ====================
  onInputChange: debounce(async function (this: any, event: any) {
    const value = event.detail

    // 获取推荐歌
    const res = await getSearchSuggestKey(value)
    const suggestSongs = res.code === 200 ? res.result.songs : []
    this.setData({ suggestSongs })
  }, 300),

  onSuggestItemTap(event: any) {
    // 搜索
    const { item } = event.currentTarget.dataset
    this.onSearch(null, item.name)
  },

  onSearch(event: any, suggestKeyword: string | undefined) {
    const searchKey = suggestKeyword ? suggestKeyword : event.detail
    const listType = 3

    wx.navigateTo({
      url: `/pages/list-song/list-song?listType=${listType}&title=${searchKey}`
    })
  }
})
