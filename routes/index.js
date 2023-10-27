var express = require('express');
var router = express.Router();

module.exports = (db) => {
  router.get('/', (req, res, next) => {
    res.render('list')
  })

  return router
}


