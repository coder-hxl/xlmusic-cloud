// components/menu-area/menu-area.ts
Component({
  properties: {
    storeMenuName: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: '标题'
    },
    menuList: {
      type: Object,
      value: {}
    }
  },

  methods: {
    handleMoreTap() {
      const storeMenuName = this.properties.storeMenuName
      wx.navigateTo({
        url: `/pages/more-song-menu/more-song-menu?storeMenuName=${storeMenuName}`
      })
    }
  }
})
