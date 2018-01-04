module.exports = {
  pathPrefix: "/pebblebed",
  plugins: [{
    resolve: "gatsby-plugin-typography",
    options: {
      pathToConfigModule: "src/utils/typography.js",
    },
  }],
}
