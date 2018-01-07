import React from "react";
import Link from "gatsby-link";

import baseStyles from "../styles/base-styles.module.scss";
import docStyles from "../templates/docs.module.scss";
import styles from "./index.module.scss";

import logo from "../images/smaller-pebble-tilted.png";
import { multi } from "../utils/css-utils";

export default ({ data }) => {
  const { markdownRemark } = data;

  return (
    <div>
      <div className={multi(baseStyles.content, styles.titleBlock)}>
        <div className={styles.imageBlockOuter}>
          <div className={styles.imageBlock}>
            <img src={logo} alt="Pebblebed" />
          </div>
        </div>
        <h1>Pebblebed</h1>
        <div className={styles.blurbBlock}>
          <h2>
            Simplifying the use of <span className={styles.googleCloud}>Google Cloud Datastore</span> in your
            Node.js projects
          </h2>
          <h3>
            A fully managed, highly scalable and omnipresent<strong>*</strong> database
          </h3>
          <div className={styles.subtext}>
            <strong>*</strong> Connect to live data in any environment - even on dev localhost if you like (be
            careful)!
          </div>
        </div>
        <Link to="/docs" className={baseStyles.button}>
          Read The Docs
        </Link>
      </div>
      <div className={styles.simpleExample}>
        <h3>A little taste</h3>
        <div className={docStyles.markdown} dangerouslySetInnerHTML={{ __html: markdownRemark.html }} />
      </div>
    </div>
  );
}

export const pageQuery = graphql`
  query SimplestExample {
    markdownRemark(frontmatter: { path: { eq: "/docs/simplest-example" } }) {
      html
      frontmatter {
        path
        title
      }
    }
  }
`;
