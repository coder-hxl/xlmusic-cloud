export function verifyLogin() {
  const userInfo = wx.getStorageSync('userInfo')
  return !!userInfo
}

export function verifyColMsg(...msgs: string[]) {
  let res = true

  for (const item of msgs) {
    const itemRes = item.split(':').pop()

    if (itemRes !== 'ok') return false
  }

  return res
}
