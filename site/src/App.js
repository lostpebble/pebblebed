import React from "react";
import { Router, Link } from "react-static";
import { createComponent } from "react-fela";

import Routes from "react-static-routes";

const AppStyles = createComponent(() => ({
  background: red,
}), "div");

export default () =>
  <Router>
    <AppStyles>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/blog">Blog</Link>
      </nav>
      <div className="content">
        <Routes />
      </div>
    </AppStyles>
  </Router>;
