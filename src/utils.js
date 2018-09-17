const jwt = require('jsonwebtoken')
const APP_SECRET = 'GraphQL-is-aw3some'

function getUserId(context) {
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const {
      userId
    } = jwt.verify(token, APP_SECRET)
    return userId
  }
  throw new Error('Not authenticated')
}

function extend(obj, src) {
  Object.keys(src).forEach(key => {
    obj[key] = src[key];
  })
  return obj;
}

module.exports = {
  APP_SECRET,
  getUserId,
  extend,
}