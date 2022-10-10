// components/nav-bar/nav-bar.ts

const app = getApp()

Component({
  options: {
    multipleSlots: true
  },
  data: {
    statusHeight: app.globalData.statusHeight,
    navHeight: app.globalData.navHeight
  },
  methods: {
    onLeftTap() {
      this.triggerEvent('lefttap')
    }
  }
})
