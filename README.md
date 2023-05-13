# XLMusic-Cloud

XLMusic-Cloud 是基于 WXML、WXSS、WXS、TypeScript、云开发、xl-store、Vant 等技术实现的原生微信音乐小程序。拥有首页、视频、个人、搜索、历史、新歌、搜索歌曲、音乐播放、视频详情、排行榜等。

> 如果对您有帮助，可以给 [XLMusic-Cloud 存储库](https://github.com/coder-hxl/xlmusic-cloud) 点个 star 支持一下！

## 技术栈

`WXML` `WXSS` `WXS` `TypeScript` `云开发` `xl-store` `Vant`

## 使用说明

- 需使用 npm 安装项目依赖, 并构建 npm
- 因个人页面使用到云开发, 如果想收藏歌曲之类的操作, 则要在云数据库中创建 c_love、c_my_song_menu、c_history 这 3 个集合

## 介绍

### 首页

展示搜索、轮播图、最新音乐、推荐歌单、精品歌单、排行榜以及播放工具栏。

- 在 onLoad 生命周期中发起网络请求以及为 Store 中的 State 添加观察，等待网络请求将数据放入 Store ，将会触发观察获取最新数据渲染到视图中。

### 视频页

展示视频列表。

- 添加下拉会进行刷新。

- 接近底部将加载更多视频。

### 个人页

展示用户信息、我的音乐以及我的歌单。

- 获取登录信息。
- 从云数据库中获取用户信息、我的音乐以及我的歌单。

### 搜索页

展示搜索框和搜索列表。

- 对搜索进行防抖处理。
- 通过关键字发起网络请求获取歌曲列表。

### 歌曲列表页

被使用为历史歌曲列表页、新歌曲列表页、搜索歌曲列表页。

- 在 onLoad 生命周期根据 url query 中不同的 listType 值发起对应的网络请求以及为 Store 中的 State 添加观察，等待网络请求将数据放入 Store ，将会触发观察获取最新数据渲染到视图中。

- 在 onUnload 生命周期取消为 Store 中的 state 观察，避免不必要的副作用影响性能。

- 在歌曲列表数据被点击弹起时
  - 为 playerStore 的 State 设置当前被点击的音乐索引以及歌曲列表。
  - 跳转到音乐播放页。

### 音乐播放页（分包）

展示歌曲或歌词。

- 在 onLoad 生命周期为 playerStore 的多个 State 添加观察。
- 为播放控件设置对应的事件处理。

### 更多歌单页

展示推荐歌单或精品歌单的更多歌单内容。

- 在 onLoad 生命周期根据 url query 中不同的 storeMenuName 值在 songMenuStore 发起网络请求以及对 State 添加观察，等待网络请求将数据放入 songMenuStore ，将会触发观察获取最新数据渲染到视图中。
- 在 onUnload 生命周期取消为 songMenuStore 中的 state 观察，避免不必要的副作用影响性能。

### 详细歌单页

被使用为喜欢详细歌单页、创建歌单详细页、基本歌单详细页。拥有歌单封面图、歌单介绍、歌单数据、歌单列表等歌单信息。

- 在 onLoad 生命周期根据 url query 中不同的参数进行不同（喜欢详细歌单页、创建歌单详细页、基本歌单详细页）处理。
- 在 onUnload 生命周期取消为 songMenuStore 中的 state 观察，避免不必要的副作用影响性能。

### 更多排行榜页

展示官方以及全球的排行榜。

- 在 onLoad 生命周期进行初始化，获取 topListStore 中 state 值。

### 详情视频页（分包）

展示视频播放、视频介绍、相关视频列表。

- 在 onLoad 生命周期根据 url query 中不同的 id 值发起对应的网络请求，等待网络请求结束，将会触发观察获取最新数据渲染到视图中。

## 后端

https://github.com/coder-hxl/NeteaseCloudMusicApi
