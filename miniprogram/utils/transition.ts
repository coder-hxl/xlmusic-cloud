const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

function capitalize(str: string) {
  const res = str.slice(0, 1).toUpperCase() + str.slice(1, str.length)

  return res
}

function parseLyric(lyric: string) {
  const lyricInfo = []
  const lyricLines = lyric.split('\n')

  for (const item of lyricLines) {
    const result = timeReg.exec(item) as any[]

    if (!result) continue

    const minute = result[1] * 60 * 1000
    const second = result[2] * 1000
    const mSecond = result[3].length === 2 ? result[3] * 10 : result[3] * 1
    const time = minute + second + mSecond
    const text = item.replace(timeReg, '')

    lyricInfo.push({ time, text })
  }

  return lyricInfo
}

function getRandomIndex(length: number, notSameIndex?: number): number {
  const index = Math.floor(Math.random() * length)

  // 结果不能是 notSameIndex
  if (notSameIndex !== undefined && notSameIndex === index) {
    return getRandomIndex(length, notSameIndex)
  }

  return index
}

export { capitalize, parseLyric, getRandomIndex }
