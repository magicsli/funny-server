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

/**
 * 转化数据库中的数据格式， 替换 ‘_id ’字段
 * @param {Document} doc mongoDb文档
 * @param {string} key id关键字
 * @returns
 */
function toJsonWidthTransfromId(doc, key = '_id') {
  if (doc.toJSON) {
    const _doc = doc.toJSON()
    _doc[key] = _doc._id
    delete _doc._id
    return _doc
  }

  return doc
}

module.exports = {
  randomString,
  toStr,
  toJsonWidthTransfromId
}
