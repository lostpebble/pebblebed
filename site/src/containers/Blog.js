import React from 'react'
import { getRouteProps, Link } from 'react-static'

const test = require('../test.md')

export default getRouteProps(({ posts }) => (
  <div>
    <div dangerouslySetInnerHTML={{ __html: test }} />
    <h1>It's blog time.</h1>
    <br />
    All Posts:
    <ul>
      {posts.map(post => (
        <li key={post.id}>
          <Link to={`/blog/post/${post.id}/`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  </div>
))
