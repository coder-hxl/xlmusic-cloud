import xlStore from 'xl-store'
import { getNewSong } from '../services/music'

const newStore = xlStore({
  state: {
    newSongs: []
  },
  actions: {
    async fetchNewSongsActions(limit = 6) {
      const res = await getNewSong(limit)
      const resMap = res.result.map((item: any) => {
        return { ...item, ar: item.song.artists }
      })
      this.newSongs = resMap
    }
  }
})

export default newStore
