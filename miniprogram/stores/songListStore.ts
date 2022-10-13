import xlStore from 'xl-store'
import { getNewSong, getSearchSong } from '../services/music'

const songlistStore = xlStore({
  state: {
    newSongs: [],
    searchSongs: []
  },
  actions: {
    async fetchNewSongsActions(limit = 6) {
      const res = await getNewSong(limit)
      const resMap = res.result.map((item: any) => {
        return { ...item, ar: item.song.artists }
      })
      this.newSongs = resMap
    },

    async fetchSearchSong(keyworld: string) {
      const res = await getSearchSong(keyworld)
      this.searchSongs = res.result.songs
    }
  }
})

export default songlistStore
