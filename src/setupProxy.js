const proxy = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(proxy('/api', { target: 'https://localhost:5000/' }))
  app.use(proxy('/api/getData', { target: 'https://localhost:5000/' }))
  app.use(proxy('/api/putData', { target: 'https://localhost:5000/' }))
  app.use(proxy('/api/deleteData', { target: 'https://localhost:5000/' }))
  app.use(proxy('/api/updateData', { target: 'https://localhost:5000/' }))
}
