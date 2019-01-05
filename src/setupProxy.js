const proxy = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(proxy('/api', { target: 'https://127.0.0.1:5000/' }))
  app.use(proxy('/api/getData', { target: 'http://127.0.0.1:5000/' }))
  app.use(proxy('/api/putData', { target: 'http://127.0.0.1:5000/' }))
  app.use(proxy('/api/deleteData', { target: 'http://127.0.0.1:5000/' }))
  app.use(proxy('/api/updateData', { target: 'http://127.0.0.1:5000/' }))
}
