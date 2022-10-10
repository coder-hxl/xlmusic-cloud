export function verifyLogin() {
  const userInfo = wx.getStorageSync('userInfo')
  return !!userInfo
}
