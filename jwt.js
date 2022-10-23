module.exports = {
  secret: 'https://github.com/magicsli/funny-im',
  excludeRouter: [/^\/login/, /^\/register/, /^\/visitor/],
  activeTime: 7 * 24 * 60 * 60 * 1000, // 7天
  tempDueTime: 1000 * 60 * 60 * 14
}
