const proxy = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(proxy('/api', { target: 'https://biff-jobb.herokuapp.com:5000/' }))
  app.use(proxy('/api/getData', { target: 'https://biff-jobb.herokuapp.com:5000/' }))
  app.use(proxy('/api/putData', { target: 'https://biff-jobb.herokuapp.com:5000/' }))
  app.use(proxy('/api/deleteData', { target: 'https://biff-jobb.herokuapp.com:5000/' }))
  app.use(proxy('/api/updateData', { target: 'https://biff-jobb.herokuapp.com:5000/' }))
}
