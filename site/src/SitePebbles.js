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

export class SitePebbles {
  fileTypeFunctions = defaultFunctionsForFiletypes;

  constructor(options = {}) {
    const { functionsForFileTypes = {} } = options;
    Object.assign(this.fileTypeFunctions, functionsForFileTypes);
  }

  createPayloadForFile(filename) {
    const extension = filename.split(".").pop();

    if (this.fileTypeFunctions[extension] != null) {
      if (typeof this.fileTypeFunctions[extension] === "function") {

      } else {
        throw new Error("SitePebbles: ");
      }
    } else {

      console.warn(`SitePebbles: Structure file [${filename}] with extension: ${extension} - but there is no function to process it - just returning as is`);
    }
  }

  createTree(pathname, parentSlugs = []) {
    let readFiles = [];

    try {
      readFiles = fs.readdirSync(pathname);
    } catch (e) {
      console.error(`Failed reading files / folders in [${pathname}], are you sure you passed the correct path?`, e.message);
    }

    readFiles.sort();

    console.log(`Got files / folders in [${pathname}]:`, readFiles);

    let pageArray = [];

    for (const file of readFiles) {
      const headingPathname = path.join(pathname, file);
      const heading = file.replace(/\d*-/g, "");
      const slug = convertToSlug(heading);

      const stat = fs.lstatSync(headingPathname);

      if (stat.isDirectory()) {
        pageArray.push({
          heading,
          parentSlugs,
          slug,
          type: null,
          payload: null,
          children: createTree(headingPathname, options, [...parentSlugs, slug]),
        });
      } else if (stat.isFile()) {
        const { type, payload } = this.createPayloadForFile(headingPathname);

        pageArray.push({
          heading,
          parentSlugs,
          slug,
          type,
          payload,
          children: null,
        });
      }

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
    }

    return pageArray;
  }
}

// export function
