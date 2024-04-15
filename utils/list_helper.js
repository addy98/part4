const _ = require('lodash')
const User = require('../models/user')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((total, blog) => {
        return total + blog.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    const likes = blogs.map(blog => blog.likes)
    const maxLikes = Math.max(...likes)
    const index = likes.indexOf(maxLikes)
    return blogs[index]
}

const mostBlogs = (blogs) => {

    const first = _.transform(blogs, (result, value) => {
        (result[value.author] || (result[value.author] = [])).push(value.title)
    }, [])

    const authors = Object.keys(first)
    const titles = Object.values(first)

    const blogCounts = []

    let most = 0
    for (let i=0; i<authors.length; i++) {
        if (titles[i].length > most) {
            most = titles[i].length
        }
        blogCounts.push(
            {
                'author': authors[i],
                'blogs': titles[i].length
            }
        )
    }
    const done = blogCounts.find(x => x.blogs === most)
    return done
}

const mostLikes = (blogs) => {
    const first = _.transform(blogs, (result, value) => {
        (result[value.author] || (result[value.author] = [])).push(value.likes)
    }, [])

    const authors = Object.keys(first)
    const likes = Object.values(first)

    const likeCounts = []

    let most = 0
    for (let i=0; i<authors.length; i++) {
        if (likes[i].reduce((partialSum, a) => partialSum + a, 0) > most) {
            most = likes[i].reduce((partialSum, a) => partialSum + a, 0)
        }
        likeCounts.push(
            {
                'author': authors[i],
                'likes': likes[i].reduce((partialSum, a) => partialSum + a, 0)
            }
        )
    }
    const done = likeCounts.find(x => x.likes === most)
    return done
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = { 
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
    usersInDb 
}