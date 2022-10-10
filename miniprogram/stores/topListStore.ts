import { getTopList } from '../services/music'
import xlStore from 'xl-store'

const topListStore = xlStore({
  state: {
    officialList: [],
    globalList: []
  },
  actions: {
    async fetchTopListAction() {
      const res = await getTopList()
      const officialList: any[] = []
      const globalList: any[] = []

      res.list.forEach((item: any) => {
        if (item.tracks.length) {
          officialList.push(item)
        } else {
          globalList.push(item)
        }
      })
      this.officialList = officialList
      this.globalList = globalList
    }
  }
})

export default topListStore
