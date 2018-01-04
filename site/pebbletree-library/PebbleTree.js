import React from "react";
import { Router, Link } from "react-static";
// import fs from "fs";

import { markdown } from "markdown";

const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const convertToSlug = (text) => {
  if (!text || text.length === 0) {
    return "";
  }

  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

const stringToConstantStyledString = (input) => {
  return input.replace(/[^\w\s]/g, "").replace("/\s/g", "_").toUpperCase();
}

function sortArrayByStringNumberPrefix(array) {
  array.sort((a, b) => {
    // return Number(a) - Number();
    return 0;
  })
}

export const defaultTypes = {
  MARKDOWN_STRING: "MARKDOWN_STRING",
  REACT_COMPONENT: "REACT_COMPONENT",
}

export const defaultFunctionsForFiletypes = {
  md: (filename) => ({ payload: markdown.toHTML(fs.readFileSync(filename, "utf-8")), type: defaultTypes.MARKDOWN_STRING }),
  js: (filename) => ({ payload: require(filename).default, type: defaultTypes.REACT_COMPONENT }),
}

const numberMatchRegex = /^\d+/;

export class PebbleTreeFactory {
  fileTypeFunctions = defaultFunctionsForFiletypes;
  static debug = false;

  rootFolder = null;
  currentTree = null;
  componentMap = {};

  static throwError(mes, { message = null } = {}) {
    throw new Error(`PebbleTree: ${mes} ${message != null ? `[${message}]` : ""}`);
  }

  static error(message) {
    console.error(`PebbleTree: ${message}`);
  }

  static warn(message) {
    console.warn(`PebbleTree: ${message}`);
  }

  static log(message) {
    if (PebbleTreeFactory.debug) {
      console.log(`PebbleTree: ${message}`);
    }
  }

  constructor(options = {}) {
    const { functionsForFileTypes = {}, debug = false } = options;

    Object.assign(this.fileTypeFunctions, functionsForFileTypes);

    PebbleTreeFactory.debug = debug;
  }

  getRoutesFromTree() {

  }

  getComponentMap() {
    return this.componentMap;
  }

  getTree() {
    return this.currentTree;
  }

  getParentAppComponent() {
    console.dir(this.componentMap);

    console.dir(this.componentMap["/"]);

    const ParentApp = this.componentMap["/"].Parent;

    /*
    * <AppStyles>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/blog">Blog</Link>
          </nav>
          <div className="content">
            <Routes />
          </div>
        </AppStyles>
    * */

    return (
      <Router>
        <ParentApp>
          <Routes />
        </ParentApp>
      </Router>
    )
  }

  createPayloadForFile(filename) {
    const extension = filename.split(".").pop();

    if (extension === filename) {
      PebbleTreeFactory.throwError(`Can't read a file without an extension. File found: ${filename}`);
    }

    if (this.fileTypeFunctions[extension] != null) {
      if (typeof this.fileTypeFunctions[extension] === "function") {
        const { payload, type } = this.fileTypeFunctions[extension](filename);

        if (payload == null) {
          PebbleTreeFactory.throwError(`Found file [${filename}] with extension [.${extension}], tried to create type [${type}] but the payload returned undefined. Is the file created properly (default export etc.)?`);
        }

        return { payload, type };
      } else {
        PebbleTreeFactory.throwError(`fileTypeFunctions object must be an object containing on keys and functions (keys for filetypes, and functions for how to deal with those files)`);
      }
    } else {
      try {
        const type = `FILE_EXTENSION_${stringToConstantStyledString(extension)}`;
        const payload = fs.readFileSync(filename, "utf-8");
        PebbleTreeFactory.warn(`Structure file [${filename}] with extension: .${extension} - but there is no function to process it - just returning as is`);

        return { type, payload };
      } catch (e) {
        PebbleTreeFactory.error(`Tried reading file ${filename} in UTF-8, but it failed. If you know how to read / transform this file yourself - pass through a function for the extension [.${extension}]`)
        return { type: null, payload: null };
      }
    }
  }

  createTree(pathname, parentSlugs = [], parentNode = null) {
    let readFiles = [];

    if (this.rootFolder == null) {
      this.rootFolder = pathname;
    }

    try {
      readFiles = fs.readdirSync(pathname);
    } catch (e) {
      PebbleTreeFactory.error(`Failed reading files / folders in [${pathname}], are you sure you passed the correct path?`, e.message);
    }

    readFiles.sort();

    PebbleTreeFactory.log(`Got files / folders in [${pathname}]:`, readFiles);

    let pageArray = [];

    for (const file of readFiles) {
      const headingPathname = path.join(pathname, file);
      const heading = file.replace(/^\d*-/g, "").split(".").shift();

      const stat = fs.lstatSync(headingPathname);

      const matches = file.match(numberMatchRegex);
      // console.dir(matches);

      const isIndex = matches != null ?
        matches[0] === "0" :
        false;

      const slug = convertToSlug(heading);

      let pagePath;

      if (isIndex) {
        pagePath = `/${parentSlugs.join("/")}`;
      } else {
        pagePath = `/${[...parentSlugs, slug].join("/")}`;
      }

      if (stat.isDirectory()) {
        // const heading = file.replace(/\d*-/g, "");
        // const slug = convertToSlug(heading);

        // const pathname = isIndex ? `/${parentSlugs.join("/")}` : `/${parentSlugs.push(slug).join("/")}`;

        const node = {
          heading: isIndex ? (parentNode != null ? parentNode.heading : "Home") : heading,
          parentSlugs,
          slug: isIndex ? (parentNode != null ? parentNode.slug : "") : slug,
          path: pagePath,
          isIndex,
          type: null,
          payload: null,
        };

        node.children = this.createTree(headingPathname, [...parentSlugs, slug], node);

        /*
        * {
          heading,
          parentSlugs,
          slug,
          path: pagePath,
          isIndex,
          type: null,
          payload: null,
          children: this.createTree(headingPathname, [...parentSlugs, slug]),
        }
        * */

        pageArray.push(node);

        if (!pageArray[pageArray.length - 1].children || pageArray[pageArray.length - 1].children.length < 1) {
          PebbleTreeFactory.error(`Shouldn't have an empty directory! -> ${headingPathname}`);
        }
      } else if (stat.isFile()) {
        const parentPath = `/${parentSlugs.join("/")}`;
        // const pathname = `${parentPath}/${slug}`;

        if (heading === `Child` || heading === "Parent") {
          PebbleTreeFactory.log(`Found ${heading} Component for path: ${parentPath}`);
          _.set(this.componentMap, [parentPath, heading], require(headingPathname).default);
          // this.componentMap[parentPath] = require(headingPathname).default;
        } else {
          const { type, payload } = this.createPayloadForFile(headingPathname);

          if (type == null || payload == null) {
            PebbleTreeFactory.warn(`Skipped adding file to tree: ${headingPathname}`);
          } else {
            pageArray.push({
              heading: isIndex ? (parentNode != null ? parentNode.heading : "Home") : heading,
              parentSlugs,
              slug: isIndex ? (parentNode != null ? parentNode.slug : "") : slug,
              path: pagePath,
              isIndex,
              type,
              payload,
              children: null,
            });
          }
        }
      }
    }

    this.currentTree = pageArray;

    return pageArray;
  }
}
