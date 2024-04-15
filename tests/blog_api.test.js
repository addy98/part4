const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

describe('blog api tests', () => {

    test('deleting all blogs', async () => {
        await Blog.deleteMany({})
        const result = (await api.get('/api/blogs')).body.length
        assert.equal(result, 0)
    })

    test('successfully create new blog post', async () => {
        const initialLength = (await api.get('/api/blogs')).body.length
        await api
            .post('/api/blogs')
            .auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkZHk5OCIsImlkIjoiNjYxZDljYTBhMGMzZGM1NWJjNmU3MTBkIiwiaWF0IjoxNzEzMjE2Njg1LCJleHAiOjE3MTMyMjAyODV9.QmsT22odu4nSc-at_gTwAxLWlR_BHVvD_bYBmrSRoRo',
            {type: 'bearer'})
            .send({
                title: 'final test blog',
                author: 'Steph Curry',
                url: 'sanfranchronicle.com'
            })
            .expect(201)
        const newLength = (await api.get('/api/blogs')).body.length
        assert.strictEqual(newLength - initialLength, 1)
    })
    
    test('fetched blogs have id property', async () => {
        const result = (await api.get('/api/blogs')).body[0]
        assert.strictEqual(result.hasOwnProperty('id'), true)
    })

    test('unauthorized to create blog without token', async () => {
        await api
            .post('/api/blogs')
            .send({
                title: 'dummy blog',
                author: 'dummy author',
                url: 'dummy.com'
            })
            .expect(401)
    })
    
    test('creates default likes property if none', async () => {
        const result = await api
            .post('/api/blogs')
            .auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkZHk5OCIsImlkIjoiNjYxZDljYTBhMGMzZGM1NWJjNmU3MTBkIiwiaWF0IjoxNzEzMjE2Njg1LCJleHAiOjE3MTMyMjAyODV9.QmsT22odu4nSc-at_gTwAxLWlR_BHVvD_bYBmrSRoRo',
            {type: 'bearer'})
            .send({
                title: 'fred again blog',
                author: 'Tyler',
                url: 'fred.com'
            })
            .expect(201)
    
        assert.strictEqual(result.body.likes, 0)
    })
    
    test('server responds with 400 Bad Request if no title or url in request body', async () => {
        await api
            .post('/api/blogs')
            .auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkZHk5OCIsImlkIjoiNjYxZDljYTBhMGMzZGM1NWJjNmU3MTBkIiwiaWF0IjoxNzEzMjE2Njg1LCJleHAiOjE3MTMyMjAyODV9.QmsT22odu4nSc-at_gTwAxLWlR_BHVvD_bYBmrSRoRo',
            {type: 'bearer'})
            .send({
                title: 'no url',
                author: 'addison'
            })
            .expect(400)
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    
    test('number of blogs fetched', async () => {
        const result = (await api.get('/api/blogs')).body.length
        assert.strictEqual(result, 2)
    })
    
    // test('delete endpoint works', async () => {
    //     await api
    //         .delete('/api/blogs/661020060405cf2879a2c27c')
    //         .expect(204)
    // })
    
    // test('put endpoint works', async () => {
    //     await api
    //         .put('/api/blogs/66182b68a250d1af058beb3f')
    //         .send({ likes: 12 })
    //         .expect(200)
    // })

    after(async () => {
        await mongoose.connection.close()
    })
})