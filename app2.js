const express = require('express')
const axios = require('axios')
const _ = require('lodash')

const app = express()
app.use(express.json())

// Define the function to fetch and analyze blog data
const fetchAndAnalyzeBlogData = async () => {
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

    // Calculate statistics using Lodash
    const totalBlogs = blogs.length
    const longestBlog = _.maxBy(blogs, blog => blog.title.length)
    const uniqueBlogTitles = _.uniqBy(blogs, blog => blog.title)
    const blogsWithPrivacy = _.filter(blogs, blog =>
      _.includes(String(blog.title).toLowerCase(), 'privacy')
    )

    return {
      totalBlogs,
      longestBlog: longestBlog.title,
      blogsWithPrivacy: blogsWithPrivacy.length,
      uniqueBlogTitles: uniqueBlogTitles.map(blog => blog.title)
    }
  } catch (error) {
    console.log(error)
    throw new Error('An error occurred while fetching and analyzing blog data.')
  }
}

// Use _.memoize to cache the function with a 5-minute expiration time
const memoizedFetchAndAnalyzeBlogData = _.memoize(
  fetchAndAnalyzeBlogData,
  param => param,
  { maxAge: 300000 }
)

// Define the function to fetch and search blog data
const fetchAndSearchBlogData = async query => {
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

    // Filter blogs based on the search query
    const searchResults = _.filter(blogs, blog =>
      blog.title.toLowerCase().includes(query.toLowerCase())
    )

    return searchResults
  } catch (error) {
    console.log(error)
    throw new Error('An error occurred while fetching blog data for search.')
  }
}

// Use _.memoize to cache the search function with a 5-minute expiration time
const memoizedFetchAndSearchBlogData = _.memoize(
  fetchAndSearchBlogData,
  query => query,
  { maxAge: 300000 }
)

// Express route for fetching and analyzing blog statistics
app.get('/api/blog-stats', async (req, res) => {
  try {
    // Provide a unique cache key, such as a timestamp or a request parameter
    const cacheKey = Date.now().toString()
    console.log(cacheKey)
    const statistics = await memoizedFetchAndAnalyzeBlogData(cacheKey)
    res.json(statistics)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Express route for searching blogs
app.get('/api/blog-search', async (req, res) => {
  const { query } = req.query

  if (!query) {
    return res
      .status(400)
      .json({ error: 'Query parameter "query" is required.' })
  }

  try {
    // Use the search query as the cache key
    const searchResults = await memoizedFetchAndSearchBlogData(query)

    res.json({ results: searchResults })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
