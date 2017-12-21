import { markdown } from "markdown";
const fs = require("fs");
const path = require("path");

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

  getTree() {
    return this.currentTree;
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

  createTree(pathname, parentSlugs = []) {
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

      const stat = fs.lstatSync(headingPathname);

      if (stat.isDirectory()) {
        const heading = file.replace(/\d*-/g, "");
        const slug = convertToSlug(heading);
        const pathname = `${parentSlugs.join("/")}/${slug}`;

        pageArray.push({
          heading,
          parentSlugs,
          slug,
          path: pathname,
          type: null,
          payload: null,
          children: this.createTree(headingPathname, [...parentSlugs, slug]),
        });

        if (!pageArray[pageArray.length - 1].children || pageArray[pageArray.length - 1].children.length < 1) {
          PebbleTreeFactory.error(`Shouldn't have an empty directory! -> ${headingPathname}`);
        }
      } else if (stat.isFile()) {
        const heading = file.replace(/^\d*-/g, "").split(".").shift();
        const slug = convertToSlug(heading);
        const parentPath = parentSlugs.join("/");
        const pathname = `${parentPath}/${slug}`;

        if (heading === `Child` || heading === "Parent") {
          PebbleTreeFactory.log(`Found ${heading} Component for path: ${parentPath}`);
          this.componentMap[parentPath] = require(headingPathname).default;
        } else {
          const { type, payload } = this.createPayloadForFile(headingPathname);

          if (type == null || payload == null) {
            PebbleTreeFactory.warn(`Skipped adding file to tree: ${headingPathname}`);
          } else {
            pageArray.push({
              heading,
              parentSlugs,
              slug,
              path: pathname,
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
