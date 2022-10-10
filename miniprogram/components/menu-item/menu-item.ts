// components/menu-item/menu-item.ts
Component({
  properties: {
    itemData: {
      type: Object,
      value: {}
    }
  },

  methods: {
    onMenuItemTap() {
      const id = this.properties.itemData.id
      const type = 3
      wx.navigateTo({
        url: `/pages/detail-song-menu/detail-song-menu?type=${type}&id=${id}`
      })
    }
  }
})
