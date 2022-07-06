module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    namedGroups: ["dropdown", "tooltip"],
  },
  plugins: [
    require("tailwindcss-named-groups"),
  ]
}