import xlStore from 'xl-store'

import { getLyric, getSongDetail } from '../services/music'
import userInfoStore from '../stores/userInfoStore'

import { parseLyric } from '../utils/transition'
import { getRandomIndex } from '../utils/transition'

export const audioContext = wx.createInnerAudioContext({
  useWebAudioImplement: true
})
const playModeList = ['order', 'repeat', 'random']

const playerStore = xlStore({
  state: {
    playSongList: [],
    playSongIndex: null,

    id: 0,
    currentSong: {},
    currentLyricText: '',
    currentLyricIndex: -1,
    currentTime: 0,
    durationTime: 0,
    lyricInfo: [],
    playModeIndex: 0, // 0:顺序播放 1:单曲循环 2:随机播放
    playModeName: 'order',

    isFirst: true,
    isPlaying: false
  },

  actions: {
    playMusicWithSongIdAction(id: number) {
      // 0.播放前初始化数据
      this.currentSong = {}
      this.lyricInfo = []
      this.currentLyricText = ''
      this.currentLyricIndex = -1
      this.durationTime = 0
      this.currentTime = 0
      this.isPlaying = true

      // 1.保存id
      this.id = id

      // 2.根据 id 获取歌信息
      // 2.1. 获取歌曲信息
      getSongDetail(id).then((res) => {
        const song = res.songs[0]
        this.currentSong = song
        this.durationTime = song.dt

        // 添加到历史记录
        userInfoStore.addHistoryAction(song)
      })
      // 2.2. 获取详细歌词
      getLyric(id).then((res) => {
        this.lyricInfo = parseLyric(res.lrc.lyric)
      })

      // 3.播放歌曲
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.autoplay = true

      // 4.监听歌曲播放
      if (this.isFirst) {
        this.isFirst = false

        audioContext.onTimeUpdate(() => {
          this.currentTime = audioContext.currentTime * 1000

          const lyricLength = this.lyricInfo.length
          let index = lyricLength - 1
          for (let i = 0; i < lyricLength; i++) {
            if (this.lyricInfo[i].time >= this.currentTime) {
              index = i - 1
              break
            }
          }

          if (index === this.currentLyricIndex) return

          this.currentLyricText = this.lyricInfo[index].text
          this.currentLyricIndex = index
        })

        audioContext.onWaiting(() => {
          audioContext.pause()
        })
        audioContext.onCanplay(() => {
          audioContext.play()
        })

        audioContext.onEnded(() => {
          if (audioContext.loop) return

          this.playNewMusicAction()
        })
      }
    },

    changeMusicStateAction() {
      if (audioContext.paused) {
        audioContext.play()
        this.isPlaying = true
      } else {
        audioContext.pause()
        this.isPlaying = false
      }
    },

    playModeTapAction() {
      // 0:顺序播放 1:单曲循环 2:随机播放
      let playModeIndex = this.playModeIndex
      playModeIndex = playModeIndex + 1

      if (playModeIndex === 3) playModeIndex = 0
      if (playModeIndex === 1) {
        audioContext.loop = true
      } else {
        audioContext.loop = false
      }

      this.playModeIndex = playModeIndex
      this.playModeName = playModeList[playModeIndex]
    },

    playNewMusicAction(isNext = true) {
      // 1.获取当前歌曲对应的索引号
      const songListLength = this.playSongList.length
      let index = this.playSongIndex
      const playModeName = this.playModeIndex

      // 2.获取要播放歌曲对应的索引号
      switch (playModeName) {
        case 1:
        case 0:
          if (isNext) {
            index = index + 1
            if (index === songListLength) index = 0
          } else {
            index = index - 1
            if (index === -1) index = songListLength - 1
          }
          break
        case 2:
          index = getRandomIndex(songListLength, index)
          break
      }

      // 4.播放新歌曲
      this.playSongIndex = index
      const id = this.playSongList[index].id
      this.playMusicWithSongIdAction(id)
    }
  }
})

export default playerStore
