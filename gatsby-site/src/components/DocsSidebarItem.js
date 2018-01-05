import React from "react";
import Link from "gatsby-link";

export default ({ edge }) => (
  <Link className={"sidebarItem"} to={edge.node.frontmatter.path}>{edge.node.frontmatter.title}</Link>
);