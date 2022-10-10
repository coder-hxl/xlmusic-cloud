import newStore from '../../stores/newStore'
import songMenuStore from '../../stores/songMenuStore'
import topListStore from '../../stores/topListStore'
import playerStore from '../../stores/playerStore'

import { getBanner } from '../../services/music'

import querySelect from '../../utils/query-select'
import throttle from '../../utils/throttle'

const querySelectThrottle = throttle(querySelect)

Page({
  data: {
    searchValue: '',
    banners: [],
    bannerHeight: 0,

    newSongs: [],

    recommendSongMenu: [],
    choicenessSongMenu: [],

    officialList: [],

    currentSong: {},
    isPlaying: playerStore.isPlaying
  },

  // 加载
  onLoad() {
    this.fetchBanner()

    newStore.watch('newSongs', this.handleData('newSongs'))
    newStore.fetchNewSongsActions()

    songMenuStore.watch(
      'recommendSongMenu',
      this.handleData('recommendSongMenu')
    )
    songMenuStore.fetchRecommendSongMenuAction()

    songMenuStore.watch(
      'choicenessSongMenu',
      this.handleData('choicenessSongMenu')
    )
    songMenuStore.fetchChoicenessSongMenuAction()

    topListStore.watch('officialList', this.handleOfficialList)
    topListStore.fetchTopListAction()

    playerStore.watch(['currentSong', 'isPlaying'], this.handlePlaySong)
  },

  async onBannerImageLoad() {
    const res = await querySelectThrottle('.banner-image')
    this.setData({ bannerHeight: res[0].height })
  },

  // 页面跳转
  onInputClick() {
    wx.navigateTo({ url: '../detail-search/detail-search' })
  },

  onRecommendMoreTap() {
    const listType = 2
    wx.navigateTo({
      url: `../list-song/list-song?listType=${listType}&title=最新音乐`
    })
  },

  onTopListMoreTap() {
    wx.navigateTo({ url: '../more-top-list/more-top-list' })
  },

  // 网络请求
  async fetchBanner() {
    const res = await getBanner(0)
    this.setData({ banners: res.banners })
  },

  // store 回调函数
  handleData(key: string, sliceNum = 6) {
    return (stateKey: string, stateValue: any) => {
      const res =
        stateValue.length > sliceNum
          ? stateValue.slice(0, sliceNum)
          : stateValue
      this.setData({ [key]: res })
    }
  },

  handleOfficialList(stateKey: string, value: any) {
    this.setData({ officialList: value })
  },

  handlePlaySong(key: string, value: any) {
    if (key === 'currentSong') {
      this.setData({ currentSong: value })
    } else if (key === 'isPlaying') {
      this.setData({ isPlaying: value })
    }
  },

  onSongItemTap(event: any) {
    const index = event.currentTarget.dataset.index
    playerStore.playSongIndex = index
    playerStore.playSongList = this.data.newSongs
  },

  onPlayBarLeftTap() {
    wx.navigateTo({ url: '/packagePlayer/pages/music-player/music-player' })
  },

  onPauseOrPlayTap() {
    playerStore.changeMusicStateAction()
  },

  onUnload() {}
})
