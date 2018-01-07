import React from "react";
import Link from "gatsby-link";

import logo from "../images/pebble-only.png";
import baseStyles from "../styles/base-styles.module.scss";
import styles from "./index.module.scss";
import { multi } from "../utils/css-utils";

require("prismjs/themes/prism-solarizedlight.css");

const GithubIcon = () =>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32.6 31.8">
    <path d="M16.3 0C7.3 0 0 7.3 0 16.3c0 7.2 4.7 13.3 11.1 15.5.8.1 1.1-.4 1.1-.8v-2.8c-4.5 1-5.5-2.2-5.5-2.2-.7-1.9-1.8-2.4-1.8-2.4-1.5-1 .1-1 .1-1 1.6.1 2.5 1.7 2.5 1.7 1.5 2.5 3.8 1.8 4.7 1.4.1-1.1.6-1.8 1-2.2-3.6-.4-7.4-1.8-7.4-8.1 0-1.8.6-3.2 1.7-4.4-.1-.3-.7-2 .2-4.2 0 0 1.4-.4 4.5 1.7 1.3-.4 2.7-.5 4.1-.5 1.4 0 2.8.2 4.1.5 3.1-2.1 4.5-1.7 4.5-1.7.9 2.2.3 3.9.2 4.3 1 1.1 1.7 2.6 1.7 4.4 0 6.3-3.8 7.6-7.4 8 .6.5 1.1 1.5 1.1 3V31c0 .4.3.9 1.1.8 6.5-2.2 11.1-8.3 11.1-15.5C32.6 7.3 25.3 0 16.3 0z" />
  </svg>;

export default ({ children }) => (
  <div className={baseStyles.app}>
    <div className={baseStyles.topBarSpacer}/>
    <div className={baseStyles.topBar}>
      <Link to={"/"} className={"title"}>
        <div className={styles.imageBlockOuter}>
          <div className={styles.imageBlock}>
            <img src={logo} alt="Pebblebed" />
          </div>
        </div>
        <span>Pebblebed</span>
      </Link>
      <Link to="/docs" className={baseStyles.button}>
        Docs
      </Link>
      <span className={baseStyles.flexGrowGap} />
      <a className={baseStyles.button} data-buttontype="secondary" target="_blank" href={"https://github.com/lostpebble/pebblebed"}>
        <span data-icon="left" className={baseStyles.icon}>
          <GithubIcon/>
        </span>
        <span>Github</span>
      </a>
    </div>
    {children()}
  </div>
);
