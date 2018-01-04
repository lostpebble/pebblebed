import React from "react";
import Link from "gatsby-link";

export default () =>
  <div style={{ color: `blue` }}>
    <h1>Hello Gatsby!</h1>
    <p>What a world.</p>
    <img src="http://lorempixel.com/400/200/" alt="" />
    <div>
      <Link to="/page-2">Page 2</Link>
    </div>
    <div>
      <Link to="/counter/">Counter</Link>
    </div>
  </div>;
