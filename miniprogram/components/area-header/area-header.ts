// components/area-header/area-header.ts
Component({
  properties: {
    title: {
      type: String,
      value: '默认标题'
    },
    more: {
      type: String,
      value: '更多'
    },
    hasMore: {
      type: Boolean,
      value: true
    }
  },

  methods: {
    onMoreTap() {
      this.triggerEvent('moretap')
    }
  }
})
