import { xlRequest } from './index'

export function getTopMV(offset = 0, limit = 20) {
  return xlRequest.get({
    url: '/top/mv',
    data: {
      offset,
      limit
    }
  })
}

export function getMVUrl(id: number) {
  return xlRequest.get({
    url: '/mv/url',
    data: { id }
  })
}

export function getMVDetail(mvid: number) {
  return xlRequest.get({
    url: '/mv/detail',
    data: { mvid }
  })
}

export function getSimiMV(mvid: number) {
  return xlRequest.get({
    url: '/simi/mv',
    data: { mvid }
  })
}
