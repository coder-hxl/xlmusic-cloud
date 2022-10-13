interface ISelectViewportItem {
  bottom: number
  dataset: {}
  height: number
  id: string
  left: number
  right: number
  top: number
  width: number
  length: number
  nv_length: number
}

export function selectViewport(target: string) {
  return new Promise<ISelectViewportItem[]>((resolve) => {
    const query = wx.createSelectorQuery()
    query.select(target).boundingClientRect()
    query.selectViewport()
    query.exec(resolve)
  })
}

export function selectAllArea(target: string) {
  return new Promise((resolve) => {
    const query = wx.createSelectorQuery()
    query.selectAll(target).boundingClientRect(resolve)
    query.exec()
  })
}

export { ISelectViewportItem }
