const { test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

test('number of blogs fetched', async () => {
    const result = (await api.get('/api/blogs')).body.length
    assert.strictEqual(result, 3)
})

test('fetched blogs have id property', async () => {
    const result = (await api.get('/api/blogs')).body[0]
    assert.strictEqual(result.hasOwnProperty('id'), true)
})

test('successfully create new blog post', async () => {
    const initialLength = (await api.get('/api/blogs')).body.length
    await api
        .post('/api/blogs')
        .send({
            title: 'music blog',
            author: 'Dorian'
        })
        .expect(201)
    const newLength = (await api.get('/api/blogs')).body.length
    assert.strictEqual(newLength - initialLength, 1)
})

test('creates default likes property if none', async () => {
    const result = await api
        .post('/api/blogs')
        .send({
            title: 'music blog',
            author: 'Dorian'
        })
        .expect(201)

    assert.strictEqual(result.body.likes, 0)
})

test('server responds with 400 Bad Request if no title or url in request body', async () => {
    await api
        .post('/api/blogs')
        .send({
            title: 'no url',
            author: 'addison'
        })
        .expect(400)
})

test('delete endpoint works', async () => {
    await api
        .delete('/api/blogs/661020060405cf2879a2c27c')
        .expect(204)
})

test.only('put endpoint works', async () => {
    await api
        .put('/api/blogs/66182b68a250d1af058beb3f')
        .send({ likes: 12 })
        .expect(200)
})

after(async () => {
    await mongoose.connection.close()
})