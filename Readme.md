# Project
Here i have created two applications, that are app.js and app2.js.

## app.js
It is with the basic use of lodash with express to fetch and deliver basic data.
It is an blog search and analythic tool.

## app2.js
Here i have also utilized the use of memoize function of lodash to cache the data and deliver it faster.

I have implemented the error handling in both the applications.

## How to run
1. Clone the repository.
2. Run `npm install` to install all the dependencies.
3. Run `npm start` to start the server.
4. Open `localhost:3000` in your browser.
5. You can also use postman to test the api.

## Routes
1. Fetch Blog Analytics:
    Route: `http://localhost:3000/api/blog-stats`
    Response Body:
    ```
    {
    "totalBlogs": 461,
    "longestBlog": "After 24 days at the box office, Sunny Deol's action film Gadar 2 became the second Hindi film to gross over ₹500 crore",
    "blogsWithPrivacy": 4,
    "uniqueBlogTitles": [
        {
            "id": "",
            "image_url": "",
            "title": ""
        }
        ...
    ]
    }
    ```
2. 
    Route: `http://localhost:3000/api/blog-search?query=query`
    Response Body:
    ```
     "results": [
        {
            "id": "",
            "image_url": "",
            "title": ""
        }
        ...
     ]
    ```

## Technologies Used
1. Node.js
2. Express.js
3. Lodash
4. Axios
5. Curl