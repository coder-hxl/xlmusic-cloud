export interface ISongMenuRecord {
  _id?: string
  _openid?: string
  name: string
  description: null | string
  coverImgUrl: null | string
  creator: {
    nickname: string
    avatarUrl: string
  }
  subscribedCount: number
  shareCount: number
  tracks: any[]
}

export interface IHistory {
  _id?: string
  _openid?: string
  tracks: any[]
}

export interface IAddOrDeleteRes {
  res: boolean
  showDialog: boolean
  successMsg?: string
  failMsg?: string
}
export interface ICreateSongMenuArg {
  name: string
  description: string
}
