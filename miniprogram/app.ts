// app.ts
interface IMyAppOptions {
  globalData: {
    statusHeight: number
    navHeight: number
    contentHeight: number
  }
}

App<IMyAppOptions>({
  globalData: {
    statusHeight: 0,
    navHeight: 44,
    contentHeight: 0
  },

  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'cloud1-9gstklhq1dc79e25',
        traceUser: true
      })
    }

    const res = wx.getSystemInfoSync()

    this.globalData.statusHeight = res.statusBarHeight
    this.globalData.contentHeight =
      res.screenHeight - res.statusBarHeight - this.globalData.navHeight
  }
})
