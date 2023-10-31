var express = require('express');
var router = express.Router();

module.exports = (db) => {
  router.get('/', (req, res, next) => {
    res.render('user/list')
  })

  router.get('/users/:id/todos', (req, res, next) => {
    res.render('todos/list', {executor: req.params.id})
  })

  return router
}
