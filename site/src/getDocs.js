import { markdown } from "markdown";
const fs = require("fs");
const path = require("path");

export function createDocsObject(pathname) {
  let headings = [];

  try {
    headings = fs.readdirSync(pathname);
  } catch (e) {
    console.error(`Get Docs Directory, are you sure the folder is setup correctly?`, e.message);
  }

  console.log(`Got headings folders:`, headings);

  let docsArray = [];

  for (const heading of headings) {
    docsArray.push({
      heading,
      hasPage: false,
      docs: [],
    });
    const headingPathname = path.join(pathname, heading);

    let docFiles = [];

    try {
      docFiles = fs.readdirSync(headingPathname);
    } catch (e) {
      console.error(
        `Tried reading heading directory for "${heading}" at ${headingPathname}, are you sure the folder is setup correctly?`,
        e.message
      );
    }

    console.log(`Got documents in heading folder [${heading}] :`, docFiles);

    for (const docFileName of docFiles) {
      try {
        const docFile = markdown.toHTML(fs.readFileSync(headingPathname, "utf-8"));
      } catch (e) {
        console.error(
          `Tried reading heading directory for "${heading}" at ${headingPathname}, are you sure the folder is setup correctly?`,
          e.message
        );
      }
    }
  }
}
