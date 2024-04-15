const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

describe('user api tests', () => {

    test('deleting all users', async () => {
        await User.deleteMany({})
        const result = (await api.get('/api/users')).body.length
        assert.equal(result, 0)
    })

    after(async () => {
        await mongoose.connection.close()
    })
})