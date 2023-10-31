var express = require('express');
var router = express.Router();

module.exports = (db) => {
  router.get('/', (req, res, next) => {
    res.render('list')
  })

  router.get('/users/:id/todos', (req, res, next) => {
    res.render('todolist', {executor: req.params.id})
  })

  return router
}
