import { xlRequest } from './index'

export function getBanner(type = 0) {
  return xlRequest.get({
    url: '/banner',
    data: { type }
  })
}

export function getNewSong(limit: number) {
  return xlRequest.get({
    url: '/personalized/newsong',
    data: { limit }
  })
}

export function getRecommendSongMenu(limit = 6) {
  return xlRequest.get({
    url: '/personalized',
    data: { limit }
  })
}

export function getChoicenessSongMenu(cat = '全部', limit = 6) {
  return xlRequest.get({
    url: '/top/playlist/highquality',
    data: { cat, limit }
  })
}

export function getTopList() {
  return xlRequest.get({ url: '/toplist/detail' })
}

export function getDetailSongMenu(id: number) {
  return xlRequest.get({ url: '/playlist/detail', data: { id } })
}

export function getSongDetail(ids: number | string) {
  return xlRequest.get({ url: '/song/detail', data: { ids } })
}

export function getLyric(id: number) {
  return xlRequest.get({ url: '/lyric', data: { id } })
}

export function getSearchSuggestKey(keywords: string) {
  return xlRequest.get({ url: '/search/suggest?keywords', data: { keywords } })
}

export function getSearchSong(keywords: string) {
  return xlRequest.get({ url: '/cloudsearch', data: { keywords } })
}
