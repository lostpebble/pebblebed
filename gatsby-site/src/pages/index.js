import React from "react";
import Link from "gatsby-link";

export default () =>
  <div style={{ margin: '3rem auto', padding: "1rem", maxWidth: 700 }}>
    <h1>Pebblebed</h1>
    <h2>Simplifying the use of Google Cloud Datastore in your Node.js projects</h2>
    <h3>A fully managed, highly scalable and omi-present* database</h3>
    <blockquote>
      <p>
        *Connect in any environment - even on dev localhost if you like (be careful)!
      </p>
    </blockquote>
    <div>
      <Link to="/page-2">Page 2</Link>
    </div>
    <div>
      <Link to="/counter/">Counter</Link>
    </div>
  </div>;
