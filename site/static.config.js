import fs from "fs";
import path from "path";
import React, { Component } from "react";
import { markdown } from "markdown";
import { createTree } from "./src/SitePebbles";

const marked = require("marked");

const siteTree = createTree(path.join(__dirname, "./src/structure"));

export default {
  getSiteProps: () => ({
    title: "Pebblebed",
  }),
  getRoutes: async () => {
    return [
      {
        path: "/",
        component: "src/containers/Home",
      },
      {
        path: "/docs",
        component: "src/containers/Blog",
        /*getProps: () => ({
          posts,
        }),
        children: docsObject.map(docs => ({
          path: `/docs/${docs.id}`,
          component: 'src/containers/Post',
          getProps: () => ({
            post,
          }),
        })),*/
      },
      {
        is404: true,
        component: "src/containers/404",
      },
    ];
  },
  renderToHtml: (render, Comp, meta) => {
    // const sheet = new ServerStyleSheet()
    const html = render(<Comp />);
    // const html = render(sheet.collectStyles(<Comp />))
    // meta.styleTags = sheet.getStyleElement()
    return html;
  },
  Document: class CustomHtml extends Component {
    render() {
      const { Html, Head, Body, children, renderMeta } = this.props;

      // {renderMeta.styleTags}

      return (
        <Html>
          <Head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </Head>
          <Body>
            {children}
          </Body>
        </Html>
      );
    }
  },
  webpack: config => {
    const renderer = new marked.Renderer();

    config.module.rules[0].oneOf.unshift({
      test: /\.md$/,
      use: [
        {
          loader: "html-loader",
        },
        {
          loader: "markdown-loader",
          options: {
            renderer,
          },
        },
      ],
    });

    return config;
  },
};
