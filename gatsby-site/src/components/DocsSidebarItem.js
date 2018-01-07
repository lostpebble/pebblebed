import React from "react";
import Link from "gatsby-link";

export default ({ edge, selected }) => {
  const className = selected ? `selected sidebarItem` : "sidebarItem";

  return (
    <Link className={className} to={edge.node.frontmatter.path}>
      {edge.node.frontmatter.title}
    </Link>
  );
};
