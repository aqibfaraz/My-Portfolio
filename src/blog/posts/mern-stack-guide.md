# How to Build a Full-Stack App with MERN Stack

Building production-ready applications with MongoDB, Express.js, React.js,
and Node.js is one of the most in-demand skills in 2025.

## What is MERN Stack?

MERN is a JavaScript full-stack framework consisting of:

- **MongoDB** — NoSQL database
- **Express.js** — Node.js web framework
- **React.js** — Frontend UI library
- **Node.js** — JavaScript runtime

This combination allows you to write end-to-end applications in a single language, JavaScript.

## Why MERN Stack?

**1. Single Language Across Stack**
You write JavaScript everywhere—frontend, backend, and database queries. This eliminates context switching.

**2. High Performance**
React's virtual DOM and Node.js's async I/O architecture make MERN apps blazingly fast.

**3. Scalability**
MongoDB's horizontal scaling and Express's lightweight architecture support growth.

**4. Job Market Demand**
MERN is actively hired by startups and enterprises. Salary expectations are 40-60% higher than single-framework developers.

## Setting Up the Backend

First, initialize your Node.js project:

```bash
mkdir mern-app && cd mern-app
npm init -y
npm install express mongoose cors dotenv
```

Create `server.js`:

```js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Basic route
app.get('/api/posts', (req, res) => {
  res.json({ message: 'Posts endpoint' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

## Setting Up MongoDB

1. Create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Copy your connection string
4. Add to `.env`:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mydb?retryWrites=true&w=majority
PORT=5000
```

## Building the React Frontend

Create your React app:

```bash
npx create-react-app client
cd client
npm install axios react-router-dom
```

Create a `client/src/api.js` to handle backend requests:

```js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getPosts = () => axios.get(`${API_URL}/posts`);
export const createPost = (post) => axios.post(`${API_URL}/posts`, post);
```

## Connecting Frontend to Backend

In your React component:

```jsx
import { useState, useEffect } from 'react';
import { getPosts } from './api';

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts()
      .then(res => setPosts(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>MERN Blog</h1>
      {posts.map(post => (
        <div key={post._id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
```

## Deployment

**Backend**: Deploy to [Heroku](https://www.heroku.com) or [Railway](https://railway.app)
**Frontend**: Deploy to [Vercel](https://vercel.com) or [Netlify](https://netlify.com)

## Conclusion

MERN stack gives you full JavaScript across the entire stack — from database to UI. Perfect for remote freelance projects and fast product delivery.

Start building today and join thousands of developers shipping production-grade apps with MERN.
