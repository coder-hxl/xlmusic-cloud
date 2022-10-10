// components/top-list-item/top-list-item.ts
Component({
  properties: {
    itemData: {
      type: Object,
      value: {}
    }
  },

  methods: {
    onTopListItemTap() {
      const id = this.properties.itemData.id
      const type = 3
      wx.navigateTo({
        url: `/pages/detail-song-menu/detail-song-menu?type=${type}&id=${id}`
      })
      wx.setNavigationBarTitle({ title: this.properties.itemData.name })
    }
  }
})
