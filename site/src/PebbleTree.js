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

  currentTree = null;

  static throwError(message, e) {
    throw new Error(`PebbleTree: ${message} [${e.message}]`);
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
        return this.fileTypeFunctions[extension](filename);
      } else {
        PebbleTreeFactory.throwError(`SitePebbles: fileTypeFunctions object must be an object containing on keys and functions (keys for filetypes, and functions for how to deal with those files)`);
      }
    } else {
      try {
        const type = `UNKNOWN_EXTENSION_${stringToConstantStyledString(extension)}`;
        const payload = fs.readFileSync(filename, "utf-8");
        PebbleTreeFactory.warn(`SitePebbles: Structure file [${filename}] with extension: .${extension} - but there is no function to process it - just returning as is`);

        return { type, payload };
      } catch (e) {
        PebbleTreeFactory.error(`Tried reading file ${filename} in UTF-8, but it failed. If you know how to read / transform this file yourself - pass through a function for the extension [.${extension}]`)
        return { type: null, payload: null };
      }
    }
  }

  createTree(pathname, parentSlugs = []) {
    let readFiles = [];

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
        const pathname = `${parentSlugs.join("/")}/${slug}`;
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

      /*
      let docFiles = [];

      try {
        docFiles = fs.readdirSync(headingPathname);
      } catch (e) {
        console.error(
          `Tried reading heading directory for "${file}" at ${headingPathname}, are you sure the folder is setup correctly?`,
          e.message
        );
      }

      docFiles.sort();

      console.log(`Got documents in heading folder [${file}] :`, docFiles);

      for (const docFile of docFiles) {
        const docFilename = path.join(headingPathname, docFile);

        try {
          const docFile = markdown.toHTML(fs.readFileSync(docFilename, "utf-8"));
        } catch (e) {
          console.error(
            `Tried reading document file "${docFile}" at ${docFilename}, are you sure the folder is setup correctly?`,
            e.message
          );
        }
      }
      */
    }

    this.currentTree = pageArray;

    return pageArray;
  }
}
