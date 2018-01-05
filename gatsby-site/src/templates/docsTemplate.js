import React from "react";

import baseStyles from "../styles/base-styles.module.scss";
import DocsSidebarItem from "../components/DocsSidebarItem";
import styles from "./docs.module.scss";

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark, allMarkdownRemark } = data; // data.markdownRemark holds our post data
  const { frontmatter, html } = markdownRemark;

  const { edges } = allMarkdownRemark;

  const sidebarItems = edges.slice(1).map(edge => <DocsSidebarItem key={edge.node.id} edge={edge}/>);

  return (
    <div className={baseStyles.pageWithSidebar}>
      <div className={baseStyles.sidebar}>
        {sidebarItems}
      </div>
      <div className={baseStyles.basicContent}>
        <div className={styles.markdown} dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}

export const pageQuery = graphql`
    query DocumentationByPath($path: String!) {
        markdownRemark(frontmatter: { path: { eq: $path } }) {
            html
            frontmatter {
                path
                title
            }
        }

        allMarkdownRemark(
            sort: { order: ASC, fields: [frontmatter___order] }
            limit: 1000
        ) {
            edges {
                node {
                    id
                    frontmatter {
                        order
                        path
                        title
                    }
                }
            }
        }
    }
`;
