const proxy = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(proxy('/api', { target: 'http://localhost:5000/' }))
  app.use(proxy('/api/getData', { target: 'http://localhost:5000/' }))
  app.use(proxy('/api/putData', { target: 'http://localhost:5000/' }))
  app.use(proxy('/api/deleteData', { target: 'http://localhost:5000/' }))
  app.use(proxy('/api/updateData', { target: 'http://localhost:5000/' }))
}
