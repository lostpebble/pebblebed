module.exports = {
  pathPrefix: "/pebblebed",
  plugins: [
    "gatsby-plugin-sass",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/markdown`,
        name: "markdown-pages",
      },
    },
    `gatsby-transformer-remark`,
  ],
}

/*
* {
    resolve: "gatsby-plugin-typography",
    options: {
      pathToConfigModule: "src/utils/typography.js",
    },
  },
* */