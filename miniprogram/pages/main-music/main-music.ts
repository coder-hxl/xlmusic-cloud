import songlistStore from '../../stores/songListStore'
import songMenuStore from '../../stores/songMenuStore'
import topListStore from '../../stores/topListStore'
import playerStore from '../../stores/playerStore'

import { getBanner } from '../../services/music'

import { selectViewport } from '../../utils/query-select'
import throttle from '../../utils/throttle'

const selectViewportThrottle = throttle(selectViewport)

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

    songlistStore.watchEffect('newSongs', this.handleData('newSongs'))
    songlistStore.fetchNewSongsActions()

    songMenuStore.watchEffect(
      'recommendSongMenu',
      this.handleData('recommendSongMenu')
    )
    songMenuStore.fetchRecommendSongMenuAction()

    songMenuStore.watchEffect(
      'choicenessSongMenu',
      this.handleData('choicenessSongMenu')
    )
    songMenuStore.fetchChoicenessSongMenuAction()

    topListStore.watchEffect('officialList', this.handleOfficialList)
    topListStore.fetchTopListAction()

    playerStore.watchEffect(['currentSong', 'isPlaying'], this.handlePlaySong)
  },

  async onBannerImageLoad() {
    const res = await selectViewportThrottle('.banner-image')
    this.setData({ bannerHeight: res[0].height })
  },

  // 页面跳转
  onInputClick() {
    wx.navigateTo({ url: '/pages/detail-search/detail-search' })
  },

  onRecommendMoreTap() {
    const listType = 2
    wx.navigateTo({
      url: `/pages/list-song/list-song?listType=${listType}&title=最新音乐`
    })
  },

  onTopListMoreTap() {
    wx.navigateTo({ url: '/pages/more-top-list/more-top-list' })
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

  onSongItemTap(event: WechatMiniprogram.Touch) {
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

  onPlayNextTap() {
    playerStore.playNewMusicAction()
  },

  onUnload() {}
})
