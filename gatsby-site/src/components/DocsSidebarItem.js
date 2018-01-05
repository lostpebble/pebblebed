import React from "react";
import Link from "gatsby-link";

export default ({ edge }) => (
  <Link to={edge.node.frontmatter.path}>{edge.node.frontmatter.title}</Link>
);