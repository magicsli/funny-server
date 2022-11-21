const { Document } = require('mongoose')

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
 * 修改对象中的_id属性
 * @param {{_id?: unknow}} obj 待修改的对象
 * @param {string} key 新的字段名
 * @returns 修改_id 字段的新对象
 */
function transformId(obj, key = '_id') {
  const _obj = { ...obj }
  _obj[key] = _obj._id
  delete _obj._id
  return _obj
}

/**
 * 转化数据库中的数据格式， 替换 ‘_id ’字段
 * @param {Document} doc mongoDb文档
 * @param {string} key id关键字
 * @returns
 */
function toJsonWidthTransfromId(doc, key = '_id') {
  var a = []
  console.log(' doc.qweQWE', a.WERQWSASDASDASD.id) // 此属性不存在， 但是不会报错

  if (doc.toJSON) {
    return transformId(doc.toJSON(), key)
  }

  if (Object.prototype.toString.call(doc) === '[Object Object]') {
    return transformId(doc, key)
  }

  throw new Error('未能成功转化_id', doc)
  // return doc
}

module.exports = {
  randomString,
  toStr,
  toJsonWidthTransfromId
}
