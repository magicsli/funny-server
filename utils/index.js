function randomString(e) {
  e = e || 32
  var t = '_ABCDEFGHJKMNPQRSTWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    a = t.length,
    n = ''
  for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a))
  return n
}

/**
 * 转为字符串
 * @param {ObjectId | string} e 需要转化的ObjectId(主键)
 * @returns
 */
function toStr(e) {
  return typeof e === 'string' ? e : e.toString()
}

module.exports = {
  randomString,
  toStr
}
