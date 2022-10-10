import xlStore from 'xl-store'

import { getChoicenessSongMenu, getRecommendSongMenu } from '../services/music'

const songMenuStore = xlStore({
  state: {
    recommendSongMenu: [],
    choicenessSongMenu: []
  },
  actions: {
    async fetchRecommendSongMenuAction(limit = 6) {
      const res = await getRecommendSongMenu(limit)
      const resMap = res.result.map((item: any) => {
        return { ...item, coverImgUrl: item.picUrl }
      })

      this.recommendSongMenu = resMap
    },
    async fetchChoicenessSongMenuAction(limit = 6) {
      const res = await getChoicenessSongMenu('全部', limit)
      this.choicenessSongMenu = res.playlists
    }
  }
})

export default songMenuStore
