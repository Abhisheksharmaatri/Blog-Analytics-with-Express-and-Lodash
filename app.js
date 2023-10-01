const express = require('express')
const axios = require('axios')
const _ = require('lodash')

const app = express()
app.use(express.json())

// Middleware to fetch and analyze blog data
app.get('/api/blog-stats', async (req, res) => {
  try {
    // Fetch blog data from the third-party API
    const response = await axios.get(
      'https://intent-kit-16.hasura.app/api/rest/blogs',
      {
        headers: {
          'x-hasura-admin-secret':
            '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
        }
      }
    )

    const blogs = { ...response.data }
    // Calculate statistics using Lodash
    const totalBlogs = blogs.blogs.length
    const longestBlog = _.maxBy(blogs.blogs, 'title.length')
    const uniqueBlogTitles = _.uniqBy(blogs.blogs, 'title')
    const blogsWithPrivacy = _.filter(blogs.blogs, blog => {
      return _.includes(String(blog.title).toLowerCase(), 'privacy')
    })

    // Respond with the statistics
    res.json({
      totalBlogs,
      longestBlog: longestBlog.title,
      blogsWithPrivacy: blogsWithPrivacy.length,
      uniqueBlogTitles: uniqueBlogTitles.map(blog => blog.title)
    })
  } catch (error) {
    console.log(error)
    // Handle errors
    res.status(500).json({
      error: 'An error occurred while fetching and analyzing blog data.'
    })
  }
})

// Search functionality
app.get('/api/blog-search', async (req, res) => {
  const { query } = req.query

  if (!query) {
    return res
      .status(400)
      .json({ error: 'Query parameter "query" is required.' })
  }

  try {
    // Fetch blog data from the third-party API
    const response = await axios.get(
      'https://intent-kit-16.hasura.app/api/rest/blogs',
      {
        headers: {
          'x-hasura-admin-secret':
            '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
        }
      }
    )

    const blogs = { ...response.data }.blogs

    const searchResults = _.filter(blogs, blog =>
      blog.title.toLowerCase().includes(query.toLowerCase())
    )

    res.json({ results: searchResults })
  } catch (error) {
    console.log(error)
    // Handle errors
    res.status(500).json({
      error: 'An error occurred while fetching and analyzing blog data.'
    })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
