import { throttle, debounce } from 'underscore'

import playerStore, { audioContext } from '../../../stores/playerStore'
import { selectAllArea } from '../../../utils/query-select'

const app = getApp()
const navHeight = app.globalData.navHeight
const statusHeight = app.globalData.statusHeight

const controlLyricScrollTopDebounce = debounce((page: any) => {
  const lyricScrollTop = page.data.lyricScrollTop
  page.setData({ isLyricScrollTop: true, lyricScrollTop })
}, 3000)

Page({
  data: {
    stateKey: [
      'id',
      'currentSong',
      'currentLyricText',
      'currentLyricIndex',
      'currentTime',
      'durationTime',
      'lyricInfo',
      'playModeIndex',
      'playModeName',
      'isPlaying',
      'playSongList'
    ],

    contentHeight: app.globalData.contentHeight,
    pageTitles: ['歌曲', '歌词'],
    currentPage: 0,
    sliderValue: 0,

    id: 0,
    lyricInfo: [],
    lyricAreas: [] as any[],
    firstLyricTop: 0,
    currentSong: {},
    currentLyricText: '',
    currentLyricIndex: -1,
    durationTime: 0,
    currentTime: 0,
    playModeIndex: 0, // 0:顺序播放 1:单曲循环 2:随机播放
    playModeName: 'order',
    playSongList: [] as any[],

    lyricScrollTop: 0,

    isPlaying: true,
    isSlider: false,
    isLyricScrollTop: true,
    showPlaySongList: false
  },

  onLoad(options: any) {
    // 1.获取传入的 id
    const id = options.id

    // 2.根据 id 播放歌曲
    if (id !== undefined) {
      playerStore.playMusicWithSongIdAction(id)
    }

    // 3.监听 store 共享数据
    playerStore.watchEffect(this.data.stateKey, this.onPlayerStore)
  },

  updateProgress: throttle(
    function (this: any) {
      if (this.data.isSlider) return

      const currentTime = audioContext.currentTime * 1000
      const sliderValue = (currentTime / this.data.durationTime) * 100
      this.setData({ currentTime, sliderValue })
    },
    500,
    { leading: false, trailing: false }
  ),

  // ================== 事件监听 ==================
  onNavBackTap() {
    wx.navigateBack()
  },

  onSwiperChange(event: any) {
    const current = event.detail.current
    this.setData({ currentPage: current })
  },

  onSliderChange(event: any) {
    // 1.滑动结束
    this.data.isSlider = false

    // 2.计算出要播放位置的时间
    const value = event.detail.value
    const currentTime = (value * this.data.durationTime) / 100
    audioContext.seek(currentTime / 1000)
  },

  onSliderChangeing: throttle(function (this: any, event: any) {
    // 1.正在滑动
    this.data.isSlider = true

    // 2.计算划动对应的播放时间
    const value = event.detail.value
    const currentTime = (value * this.data.durationTime) / 100
    this.setData({ currentTime })
  }, 100),

  onTabTap(event: any) {
    const index = event.currentTarget.dataset.index
    this.setData({ currentPage: index })
  },

  onPlayOrPauseTap() {
    playerStore.changeMusicStateAction()
  },

  onPlayModeTap() {
    playerStore.playModeTapAction()
  },

  onPlayPrevTap() {
    playerStore.playNewMusicAction(false)
  },

  onPlayNextTap() {
    playerStore.playNewMusicAction()
  },

  onPlaySongListTap() {
    this.setData({ showPlaySongList: true })
  },

  onPlaySongListClose() {
    this.setData({ showPlaySongList: false })
  },

  onSongListItemTap(event: any) {
    const { id } = event.currentTarget.dataset
    playerStore.playMusicWithSongIdAction(id)
    this.setData({ showPlaySongList: false })
  },

  onDeleteListItemTap(event: any) {
    const { id } = event.currentTarget.dataset
    const newPlaySongList = this.data.playSongList.filter(
      (item) => item.id !== id
    )
    playerStore.playSongList = newPlaySongList
  },

  onLyricDragend() {
    this.data.isLyricScrollTop = false

    controlLyricScrollTopDebounce(this)
  },

  // ================== Store ==================
  onPlayerStore(key: string, value: any) {
    if (key === 'id') {
      this.data.id = value
    } else if (key === 'currentSong') {
      this.setData({ currentSong: value })
    } else if (key === 'currentLyricText') {
      this.setData({ currentLyricText: value })
    } else if (key === 'currentLyricIndex') {
      const isLyricScrollTop = this.data.isLyricScrollTop

      const itemArea = this.data.lyricAreas[value] ?? {}
      const contentHeight = this.data.contentHeight

      // 14 是播放的歌词的 padding 上下值
      const lyricScrollTop =
        itemArea.top - (contentHeight / 2 + navHeight + statusHeight + 14) ?? 0

      this.setData({ currentLyricIndex: value })

      if (isLyricScrollTop) {
        this.setData({ lyricScrollTop })
      } else {
        this.data.lyricScrollTop = lyricScrollTop
      }
    } else if (key === 'currentTime') {
      if (value === 0) this.setData({ currentTime: value, sliderValue: value })
      this.updateProgress()
    } else if (key === 'durationTime') {
      this.setData({ durationTime: value })
    } else if (key === 'lyricInfo') {
      this.setData({ lyricInfo: value }, () => {
        selectAllArea('.lyric-item').then((res: any) => {
          const lyricAreas = res

          if (!lyricAreas.length) return

          const firstLyricTop = res[0].height + navHeight + statusHeight

          this.setData({ lyricAreas, firstLyricTop })
        })
      })
    } else if (key === 'playModeName') {
      this.setData({ playModeName: value })
    } else if (key === 'isPlaying') {
      this.setData({ isPlaying: value })
    } else if (key === 'playSongList') {
      this.setData({ playSongList: value })
    }
  },

  onUnload() {
    playerStore.deleteWatch(this.data.stateKey, this.onPlayerStore)
  }
})
