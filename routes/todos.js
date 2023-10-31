const { name } = require('ejs')
var express = require('express');
const { ObjectId } = require('mongodb')
var router = express.Router();

module.exports = function (db) {

    const Todo = db.collection('todos')
    const User = db.collection('users')

    router.get('/', async (req, res, next) => {
        try {
            const { page = 1, limit = 10, title, startDate, endDate, complete, executor, sortMode, sortBy } = req.query
            const params = {}
            const sort = {}
            sort[sortBy] = sortMode == 'asc' ? 1 : -1
            const offset = (page - 1) * 5

            if (title) {
                params['title'] = new RegExp(title, 'i')
            }

            if (startDate && endDate) {
                params['deadline'] = {
                    $gte: startDate,
                    $lte: endDate
                }
            } else if (startDate) {
                params['deadline'] = { $gte: startDate }
            } else if (endDate) {
                params['deadline'] = { $lte: endDate }
            }

            if (complete) {
                params['complete'] = JSON.parse(complete)
            }

            if (executor) {
                params['executor'] = new ObjectId(executor)
            }

            const total = await Todo.count(params)
            const pages = Math.ceil(total / limit)

            const todos = await Todo.find(params).limit(parseInt(limit)).skip(offset).toArray();
            res.json({ data: todos, total, pages, page, limit })

        } catch (error) {
            res.status(500).json({ error })
        }
    })

    router.post('/', async (req, res, next) => {
        try {
            const { title, executor } = req.body
            const todos = await Todo.insertOne({ title: title, complete: false, deadline: new Date().toISOString(), executor: executor })
            const data = await Todo.find({ _id: new ObjectId(todos.insertedId) }).toArray()
            res.status(201).json(data)
        } catch (err) {
            console.log(err)
            res.status(500).json({ err })
        }
    })

    router.get('/:id', async (req, res, next) => {
        try {
            const id = req.params.id
            const todo = await Todo.findOne({ _id: new ObjectId(id) })
            res.status(201).json(todo)
        } catch (error) {
            res.status(500).json({ error })
        }
    })

    router.put('/:id', async (req, res, next) => {
        try {
            const id = req.params.id
            const { title, deadline, complete } = req.body
            const todo = await Todo.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { title: title, complete: JSON.parse(complete), deadline: deadline } }, { returnOriginal: false })
            console.log(todo)
            res.status(201).json(todo)
        } catch (error) {
            res.status(500).json({ error })
        }
    })

    router.delete('/:id', async (req, res, next) => {
        try {
            const id = req.params.id
            const todo = await Todo.findOneAndDelete({ _id: new ObjectId(id) })
            res.status(201).json(todo)
        } catch (error) {
            res.status(500).json({ error })
        }
    })

    return router;

}



