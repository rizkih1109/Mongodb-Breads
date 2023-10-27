const { name } = require('ejs')
var express = require('express');
const { ObjectId } = require('mongodb')
var router = express.Router();

module.exports = function (db) {

  const User = db.collection('users')

  router.get('/', async (req, res, next) => {
    try {
      const { page = 1, limit = 5, search = '', sortMode, sortBy } = req.query
      const params = {}
      const sort = {}
      sort[sortBy] = sortMode == 'asc' ? 1 : -1
      const offset = (page - 1) * 5

      if (search) {
        params['$or'] = [{ "name": new RegExp(search, 'i') }, { "phone": new RegExp(search, "i") }]
      }

      const total = await User.count(params)
      const pages = Math.ceil(total / limit)

      const users = await User.find(params).toArray();
      res.json({ data: users, page, total, pages, limit, offset })

    } catch (error) {
      res.status(500).json({ error })
    }
  })

  router.post('/', async (req, res, next) => {
    console.log(req.body)
    try {
      const { name, phone } = req.body
      const users = await User.insertOne({ name: name, phone: phone })
      res.status(201).json(users)
    } catch (err) {
      console.log(err)
      res.status(500).json({ err })
    }
  })

  router.get('/:id', async (req, res, next) => {
    try {
      const id = req.params.id
      const user = await User.findOne({_id: new ObjectId(id)})
      res.status(201).json(user)
    } catch (error) {
      res.status(500).json({error})
    }
  })

  router.put('/:id', async (req, res, next) => {
    try {
      const id = req.params.id
      const {name, phone} = req.body
      const user = await User.updateOne({_id: new ObjectId(id)}, {$set: {name: name, phone: phone}})
      res.status(201).json(user)
    } catch (error) {
      res.status(500).json({error})
    }
  })

  router.delete('/:id', async (req, res, next) => {
    try {
      const id = req.params.id
      const user = await User.deleteOne({_id: new ObjectId(id)})
      res.status(201).json(user)
    } catch (error) {
      res.status(500).json({error})
    }
  })

  return router;

}




