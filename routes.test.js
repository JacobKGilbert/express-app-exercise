process.env.NODE_ENV = 'test'

const request = require('supertest')
const app = require('./app')

let items = require('./fakeDb')
let pickles = { name: 'Pickles', price: 2.49 }
let buns = { name: 'Buns', price: 3.68 }

beforeEach(function () {
  items.push(pickles)
  items.push(buns)
})

afterEach(function () {
  // make sure this *mutates*, not redefines, `items`
  items.length = 0
})

describe('GET /items', () => {
  test('Get all items', async () => {
    const res = await request(app).get('/items')
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ items: [pickles, buns] })
  })
})

describe('POST /items', () => {
  test('Post new item to items array', async () => {
    const burger = { name: 'Burger', price: 2.00 }
    const res = await request(app).post('/items').send(burger)
    expect(res.statusCode).toBe(201)
    expect(res.body).toEqual({ item: burger })
  })
})

describe('GET /items/:name', () => {
  test('Get select item', async () => {
    const res = await request(app).get(`/items/${pickles.name}`)
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ item: pickles })
  })
  test('Returns 404 if item is not found', async () => {
    const res = await request(app).get('/items/Chicken')
    expect(res.statusCode).toBe(404)
  })
})

describe('PATCH /items/:name', () => {
  test('Update select item', async () => {
    const updatedPickle = { name: 'Pickle', price: 1.49 }
    const res = await request(app)
      .patch(`/items/${pickles.name}`)
      .send(updatedPickle)
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ updated: updatedPickle })
  })
  test('Returns 404 if item is not found', async () => {
    const updatedChicken = { name: 'Chicken', price: 6.99 }
    const res = await request(app)
      .patch(`/items/Chicken`)
      .send(updatedChicken)
    expect(res.statusCode).toBe(404)
  })
})

describe('DELETE /items/:name', () => {
  test('Delete select item', async () => {
    const res = await request(app).delete(`/items/${buns.name}`)
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ message: 'Deleted' })
  })
  test('Returns 404 if item is not found', async () => {
    const res = await request(app).delete(`/items/Chicken`)
    expect(res.statusCode).toBe(404)
  })
})