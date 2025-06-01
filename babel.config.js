module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          browsers: ["last 2 versions"]
        }
      }
    ]
  ],
  plugins: [
    [
      "babel-plugin-istanbul",
      {
        exclude: [
          "**/*.test.js",
          "tests/**",
          "mocks/**"
        ]
      }
    ]
  ]
};