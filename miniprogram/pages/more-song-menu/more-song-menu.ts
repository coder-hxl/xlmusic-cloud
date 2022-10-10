import { capitalize } from '../../utils/transition'
import songMenuStore from '../../stores/songMenuStore'

Page({
  data: {
    storeMenuName: '',
    songMenu: []
  },

  onLoad(options: any) {
    const storeMenuName: string = (this.data.storeMenuName =
      options.storeMenuName)
    const actionName = this.getStoreActionName(storeMenuName)

    songMenuStore.watch(storeMenuName, this.fetchSongMenu)
    songMenuStore[actionName](50)
  },

  getStoreActionName(storeMenuName: string) {
    const name = capitalize(storeMenuName)

    return 'fetch' + name + 'Action'
  },

  fetchSongMenu(key: string, value: any) {
    this.setData({ songMenu: value })
  },

  onUnload() {
    songMenuStore.deleteWatch(this.data.storeMenuName, this.fetchSongMenu)
  }
})
