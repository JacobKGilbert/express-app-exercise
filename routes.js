const express = require('express')
const router = new express.Router()
const ExpressError = require('./errors')
const items = require('./fakeDb')

/** GET /items: get list of items */
router.get('/', (req, res) => {
  return res.status(200).json({ items: items })
})

/** POST /items: posts a new item into items array */
router.post('/', (req, res) => {
  const newItem = { name: req.body.name, price: req.body.price }
  items.push(newItem)
  return res.status(201).json({ item: newItem })
})

/** GET /items/:name: get item by name */
router.get('/:name', (req, res) => {
  const foundItem = items.find(item => item.name === req.params.name)
  if (foundItem === undefined) throw new ExpressError('Item not found', 404)
  return res.status(200).json({ item: foundItem })
})

/** PATCH /items/:name: get item by name and update */
router.patch('/:name', (req, res) => {
  const foundItem = items.find((item) => item.name === req.params.name)
  if (foundItem === undefined) throw new ExpressError('Item not found', 404)
  foundItem.name = req.body.name
  foundItem.price = req.body.price
  return res.status(200).json({ updated: foundItem })
})

/** DELETE /items/:name: delete item, return status */
router.delete('/:name', function (req, res) {
  const foundItem = items.findIndex((item) => item.name === req.params.name)
  if (foundItem === -1) throw new ExpressError('Item not found', 404)
  items.splice(foundItem, 1)
  return res.status(200).json({ message: 'Deleted' })
})

module.exports = router